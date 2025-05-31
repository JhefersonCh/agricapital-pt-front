import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { About } from './About';

const mockUseAuth = vi.fn();
const mockUseNavigate = vi.fn();

vi.mock('@/shared/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const mod = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...mod,
    useNavigate: () => mockUseNavigate,
    BrowserRouter: mod.BrowserRouter,
  };
});

describe('About', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all static content correctly', () => {
    mockUseAuth.mockReturnValue({ user: null });

    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>,
    );

    expect(screen.getByText('Nuestra Historia')).toBeInTheDocument();
    expect(screen.getByText('futuro agrícola')).toBeInTheDocument();
    expect(
      screen.getByText(
        /En AgriCapital creemos que cada productor merece acceso/i,
      ),
    ).toBeInTheDocument();

    expect(screen.getByText('Nuestra Misión')).toBeInTheDocument();
    expect(screen.getByText('Nuestra Visión')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Democratizar el acceso al crédito agrícola en Colombia mediante tecnología innovadora, evaluaciones justas y un profundo entendimiento de las necesidades del sector rural.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `Ser la plataforma líder de financiamiento agrícola en América Latina, impulsando el crecimiento sostenible del sector y mejorando la calidad de vida de las comunidades rurales.`,
      ),
    ).toBeInTheDocument();

    expect(screen.getByText('Nuestros Valores')).toBeInTheDocument();
    expect(screen.getByText('Compromiso Social')).toBeInTheDocument();
    expect(screen.getByText('Transparencia')).toBeInTheDocument();
    expect(screen.getByText('Innovación')).toBeInTheDocument();
    expect(screen.getByText('Cercanía')).toBeInTheDocument();

    expect(screen.getByText('Nuestro Camino')).toBeInTheDocument();
    expect(screen.getByText('Fundación')).toBeInTheDocument();
    expect(screen.getByText('2020')).toBeInTheDocument();
    expect(screen.getByText('Liderazgo')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(screen.getByText('Nuestro Proceso')).toBeInTheDocument();
    expect(screen.getByText('Solicitud Digital')).toBeInTheDocument();
    expect(screen.getByText('Evaluación IA')).toBeInTheDocument();
    expect(screen.getByText('Desembolso')).toBeInTheDocument();

    expect(screen.getByText('Nuestro Impacto')).toBeInTheDocument();
    expect(screen.getByText('Familias Beneficiadas')).toBeInTheDocument();
    expect(screen.getByText('5,000+')).toBeInTheDocument();
    expect(screen.getByText('Departamentos')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('Hectáreas Financiadas')).toBeInTheDocument();
    expect(screen.getByText('15,000')).toBeInTheDocument();
    expect(screen.getByText('Satisfacción Cliente')).toBeInTheDocument();
    expect(screen.getByText('98%')).toBeInTheDocument();

    expect(screen.getByText('Tecnología de Punta')).toBeInTheDocument();
    expect(
      screen.getByText('Innovación al servicio del campo'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Algoritmos especializados en riesgo agrícola'),
    ).toBeInTheDocument();
    expect(screen.getByText('Mejor Fintech Agrícola 2024')).toBeInTheDocument();

    expect(
      screen.getByText('¿Quieres ser parte de nuestra historia?'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Solicitar Crédito/i }),
    ).toBeInTheDocument();
  });

  it('navigates to user-specific credit request page if user is authenticated', () => {
    const mockUserId = 'test-user-123';
    mockUseAuth.mockReturnValue({
      user: { id: mockUserId, name: 'Test User' },
    });

    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>,
    );

    const creditButton = screen.getByRole('button', {
      name: /Solicitar Crédito/i,
    });
    fireEvent.click(creditButton);

    expect(mockUseNavigate).toHaveBeenCalledTimes(1);
    expect(mockUseNavigate).toHaveBeenCalledWith(
      `/credit/request-by-client/${mockUserId}`,
    );
  });

  it('navigates to login page if user is not authenticated', () => {
    mockUseAuth.mockReturnValue({ user: null });

    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>,
    );

    // Encuentra el botón y simula un click
    const creditButton = screen.getByRole('button', {
      name: /Solicitar Crédito/i,
    });
    fireEvent.click(creditButton);

    // Verifica que la función navigate fue llamada una vez y con la ruta de login
    expect(mockUseNavigate).toHaveBeenCalledTimes(1);
    expect(mockUseNavigate).toHaveBeenCalledWith('/auth/login');
  });
});
