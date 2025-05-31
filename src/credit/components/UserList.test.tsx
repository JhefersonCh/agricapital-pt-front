/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { UserList } from './UserList';
import { UserService } from '../services/userService';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

vi.mock('../services/userService', () => ({
  UserService: {
    fetchClientUsers: vi.fn(),
  },
}));

const mockedUsedNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockedUsedNavigate,
  };
});

describe('UserList', () => {
  const mockUsers = [
    {
      id: 1,
      name: 'Alice Smith',
      email: 'alice@example.com',
      phone: '111-222-3333',
    },
    {
      id: 2,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '444-555-6666',
    },
    {
      id: 3,
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      phone: '777-888-9999',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (UserService.fetchClientUsers as any).mockReturnValue(
      new Promise(() => {}),
    );

    render(
      <BrowserRouter>
        <UserList />
      </BrowserRouter>,
    );

    expect(screen.getByText('Cargando usuarios...')).toBeInTheDocument();
  });

  it('displays user data after successful fetch', async () => {
    (UserService.fetchClientUsers as any).mockResolvedValue({
      data: mockUsers,
      count: mockUsers.length,
    });

    render(
      <BrowserRouter>
        <UserList />
      </BrowserRouter>,
    );

    await waitFor(() =>
      expect(
        screen.queryByText('Cargando usuarios...'),
      ).not.toBeInTheDocument(),
    );

    expect(screen.getByText('Listado de Clientes')).toBeInTheDocument();
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    expect(screen.getByText('111-222-3333')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    expect(screen.getByText('Charlie Brown')).toBeInTheDocument();
  });

  it('handles API error gracefully', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    (UserService.fetchClientUsers as any).mockRejectedValue(
      new Error('Network error'),
    );

    render(
      <BrowserRouter>
        <UserList />
      </BrowserRouter>,
    );

    await waitFor(() =>
      expect(
        screen.queryByText('Cargando usuarios...'),
      ).not.toBeInTheDocument(),
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error al cargar usuarios:',
      expect.any(Error),
    );
    expect(screen.queryByText('Alice Smith')).not.toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it('pagination updates the page correctly', async () => {
    (UserService.fetchClientUsers as any)
      .mockResolvedValueOnce({
        data: mockUsers,
        count: 20,
      })
      .mockResolvedValueOnce({
        data: [
          {
            id: 4,
            name: 'David Lee',
            email: 'david@example.com',
            phone: '000-111-2222',
          },
        ], // Second page data
        count: 20,
      });

    render(
      <BrowserRouter>
        <UserList />
      </BrowserRouter>,
    );

    await waitFor(() =>
      expect(screen.getByText('Alice Smith')).toBeInTheDocument(),
    );

    const nextPageButton = screen.getByLabelText('Go to next page');

    await userEvent.click(nextPageButton);

    await waitFor(() => {
      expect(UserService.fetchClientUsers).toHaveBeenCalledTimes(2);
      expect(UserService.fetchClientUsers).toHaveBeenCalledWith(2, 10);
    });

    await waitFor(() =>
      expect(screen.getByText('David Lee')).toBeInTheDocument(),
    );
    expect(screen.queryByText('Alice Smith')).not.toBeInTheDocument();
  });

  it('navigates to credit page on button click', async () => {
    (UserService.fetchClientUsers as any).mockResolvedValue({
      data: mockUsers,
      count: mockUsers.length,
    });

    render(
      <BrowserRouter>
        <UserList />
      </BrowserRouter>,
    );

    await waitFor(() =>
      expect(screen.getByText('Alice Smith')).toBeInTheDocument(),
    );

    const creditButton = screen.getAllByRole('button', { name: 'Crédito' })[0];

    await userEvent.click(creditButton);

    expect(mockedUsedNavigate).toHaveBeenCalledWith('/credit/init/1');
  });
});
