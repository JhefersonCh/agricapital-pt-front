/* eslint-disable @typescript-eslint/prefer-as-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { vi, type Mock } from 'vitest';
import NavBar from './NavBar'; // Ajusta la ruta si es necesario
import { useAuth } from '@/shared/contexts/AuthContext';
import { useRole } from '@/shared/contexts/RoleContext';
import { NotificationsService } from '@/shared/services/notificationsService'; // Asegúrate que la importación sea correcta

// --- Mocks Globales y Configuraciones ---

// Mockea los módulos primero
vi.mock('@/shared/contexts/AuthContext');
vi.mock('@/shared/contexts/RoleContext');
vi.mock('@/shared/services/notificationsService');

// Mock para WebSocket (puedes necesitar ajustarlo o hacerlo más dinámico si un test lo requiere)
type Procedure = (...args: any[]) => any;

const mockWebSocketInstance = {
  // --- Propiedades de estado y constantes como literales ---
  // Asumiendo que tu tipo WebSocket espera estas constantes EN LA INSTANCIA:
  readyState: 1 as 1, // O 0 as 0, 2 as 2, 3 as 3, según el estado que quieras mockear.
  // El tipo de readyState en la interfaz WebSocket suele ser una unión como: 0 | 1 | 2 | 3
  CONNECTING: 0 as 0,
  OPEN: 1 as 1,
  CLOSING: 2 as 2,
  CLOSED: 3 as 3,

  // --- Manejadores de eventos y métodos ---
  onopen: vi.fn() as Mock<Procedure>,
  onmessage: vi.fn() as Mock<Procedure>,
  onclose: vi.fn() as Mock<Procedure>,
  onerror: vi.fn() as Mock<Procedure>,
  send: vi.fn() as Mock<Procedure>,
  close: vi.fn() as Mock<Procedure>,
  addEventListener: vi.fn() as Mock<Procedure>,
  removeEventListener: vi.fn() as Mock<Procedure>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dispatchEvent: vi.fn((event: Event) => true) as Mock<
    (event: Event) => boolean
  >,

  binaryType: 'blob' as BinaryType,
  bufferedAmount: 0,
  extensions: '',
  protocol: '',
  url: 'ws://localhost:8080/mock',
};
vi.stubGlobal(
  'WebSocket',
  vi.fn(() => mockWebSocketInstance),
);

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

if (!import.meta.env.VITE_WS_URL) {
  Object.defineProperty(import.meta, 'env', {
    value: { ...import.meta.env, VITE_WS_URL: 'ws://localhost:8080' },
    writable: true,
  });
}

describe('NavBar', () => {
  describe('when user is not authenticated', () => {
    beforeEach(() => {
      vi.mocked(useAuth).mockReturnValue({
        session: null,
        loading: false,
        signOut: vi.fn(),
        user: null,
      });
      vi.mocked(useRole).mockReturnValue({
        role: null,
        setRole: vi.fn(),
        loadingRole: false,
      });
      mockNavigate.mockClear();
    });

    test('renders public navigation links and login button', () => {
      render(
        <BrowserRouter>
          <NavBar />
        </BrowserRouter>,
      );

      expect(screen.getByText('Inicio')).toBeInTheDocument();
      expect(screen.getByText('Nosotros')).toBeInTheDocument();
      expect(screen.queryByText('Clientes')).not.toBeInTheDocument();
      expect(screen.queryByText('Solicitudes')).not.toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /iniciar sesión/i }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /open user menu/i }),
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Tu Perfil')).not.toBeInTheDocument();
      expect(screen.queryByText('Cerrar sesión')).not.toBeInTheDocument();
    });
  });

  describe('when user is authenticated', () => {
    const mockUser = {
      id: 'test-user-123',
      user_metadata: { avatar_url: 'https://example.com/avatar.png' },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    };
    const mockSession = {
      user: mockUser,
      access_token: 'fake-token',
      refresh_token: 'fake-refresh-token',
      expires_in: 3600,
      token_type: 'bearer',
    };

    beforeEach(() => {
      vi.mocked(useAuth).mockReturnValue({
        session: mockSession,
        loading: false,
        signOut: vi.fn().mockResolvedValue({ error: null }),
        user: mockUser,
      });
      vi.mocked(NotificationsService).mockImplementation(() => ({
        getNotifications: vi.fn().mockResolvedValue({ data: [] }),
      }));
      mockNavigate.mockClear();
      mockWebSocketInstance.onmessage = vi.fn();
      mockWebSocketInstance.close.mockClear();
      vi.mocked(global.WebSocket)
        .mockClear()
        .mockImplementation(() => mockWebSocketInstance);
    });

    test('renders user menu, notification icon, and basic navigation', async () => {
      vi.mocked(useRole).mockReturnValue({
        role: {
          permissions: ['/'],
          id: 0,
          name: '',
        },
        setRole: vi.fn(),
        loadingRole: false,
      });

      render(
        <BrowserRouter>
          <NavBar />
        </BrowserRouter>,
      );

      expect(
        screen.queryByRole('button', { name: /iniciar sesión/i }),
      ).not.toBeInTheDocument();
      expect(screen.getByTitle('Abrir menú')).toBeInTheDocument();
      expect(screen.getByAltText('')).toHaveAttribute(
        'src',
        mockUser.user_metadata.avatar_url,
      );

      await waitFor(() => {
        expect(global.WebSocket).toHaveBeenCalledWith(
          `${import.meta.env.VITE_WS_URL}/${mockUser.id}`,
        );
      });
    });

    test('displays user profile, settings, and logout options in menu', async () => {
      vi.mocked(useRole).mockReturnValue({
        role: {
          permissions: ['/'],
          id: 0,
          name: '',
        },
        setRole: vi.fn(),
        loadingRole: false,
      });
      render(
        <BrowserRouter>
          <NavBar />
        </BrowserRouter>,
      );

      const userMenuButton = screen.getByTitle('Abrir menú');
      await fireEvent.click(userMenuButton);

      expect(screen.getByTitle('Abrir menú')).toBeInTheDocument();
    });

    test('renders navigation links based on role permissions', () => {
      vi.mocked(useRole).mockReturnValue({
        role: {
          permissions: ['/', 'credit/clients'],
          id: 0,
          name: '',
        },
        setRole: vi.fn(),
        loadingRole: false,
      });

      render(
        <BrowserRouter>
          <NavBar />
        </BrowserRouter>,
      );
      expect(screen.getByText('Inicio')).toBeInTheDocument();
      expect(screen.getByText('Nosotros')).toBeInTheDocument();
      expect(screen.getByText('Clientes')).toBeInTheDocument();
    });

    test('updates notifications when a WebSocket message is received', async () => {
      vi.mocked(NotificationsService).mockImplementation(() => ({
        getNotifications: vi.fn().mockResolvedValue({ data: [] }),
      }));
      vi.mocked(useRole).mockReturnValue({
        role: {
          permissions: ['/'],
          id: 0,
          name: '',
        },
        setRole: vi.fn(),
        loadingRole: false,
      });

      render(
        <BrowserRouter>
          <NavBar />
        </BrowserRouter>,
      );

      // Asegura que la conexión WS se haya intentado y onmessage esté asignado
      await waitFor(() => {
        expect(global.WebSocket).toHaveBeenCalledWith(
          `${import.meta.env.VITE_WS_URL}/${mockUser.id}`,
        );
        expect(mockWebSocketInstance.onmessage).toBeInstanceOf(Function);
      });

      const wsNotification = {
        id: 'ws-notif-1',
        message: 'Live Update!',
        read: false,
        created_at: new Date().toISOString(),
        user_id: mockUser.id,
      };

      act(() => {
        if (mockWebSocketInstance.onmessage) {
          mockWebSocketInstance.onmessage({
            data: JSON.stringify(wsNotification),
          } as MessageEvent);
        }
      });
    });
  });

  describe('when authentication is loading', () => {
    beforeEach(() => {
      vi.mocked(useAuth).mockReturnValue({
        session: null,
        loading: true,
        signOut: vi.fn(),
        user: null,
      });
      vi.mocked(useRole).mockReturnValue({
        role: null,
        setRole: vi.fn(),
        loadingRole: false,
      });
    });

    test('renders a loader in the auth section', () => {
      render(
        <BrowserRouter>
          <NavBar />
        </BrowserRouter>,
      );
      expect(document.querySelector('.animate-spin')).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /iniciar sesión/i }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /open user menu/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe('navigation behavior', () => {
    beforeEach(() => {
      vi.mocked(useAuth).mockReturnValue({
        session: null,
        loading: false,
        signOut: vi.fn(),
        user: null,
      });
      vi.mocked(useRole).mockReturnValue({
        role: null,
        setRole: vi.fn(),
        loadingRole: false,
      });
      mockNavigate.mockClear();
    });

    test('calls navigate when a navigation link is clicked', async () => {
      render(
        <MemoryRouter initialEntries={['/about']}>
          <NavBar />
        </MemoryRouter>,
      );

      const homeLink = screen.getByText('Inicio');
      expect(homeLink).not.toHaveAttribute('aria-current', 'page');

      const aboutLink = screen.getByText('Nosotros');
      expect(aboutLink).toHaveAttribute('aria-current', 'page');

      await fireEvent.click(homeLink);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
