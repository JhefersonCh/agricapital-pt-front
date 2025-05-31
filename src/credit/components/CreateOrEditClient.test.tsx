/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { CreateClient } from './CreateOrEditClient';
import { supabase } from '@/supabaseClient';

vi.mock('@/supabaseClient', () => {
  const mockSignUp = vi.fn();
  const mockInsert = vi.fn();
  const mockFrom = vi.fn((tableName) => {
    if (tableName === 'users') {
      return {
        insert: mockInsert,
      };
    }
    return {
      insert: vi.fn(),
    };
  });

  return {
    supabase: {
      auth: {
        signUp: mockSignUp,
      },
      from: mockFrom,
    },
    _mockSignUp: mockSignUp,
    _mockFrom: mockFrom,
    _mockInsert: mockInsert,
  };
});

describe('CreateClient', () => {
  let mockSupabase: {
    auth: { signUp: ReturnType<typeof vi.fn> };
    from: ReturnType<typeof vi.fn>;
  };
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let insertSpy: ReturnType<typeof vi.fn>;
  let fromSpy: ReturnType<typeof vi.fn>;
  let signUpSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase = supabase as any;
    signUpSpy = mockSupabase.auth.signUp;
    insertSpy = mockSupabase.from('users').insert;
    fromSpy = mockSupabase.from;

    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    signUpSpy.mockResolvedValue({
      data: {
        user: { id: 'test-user-id', email: 'test@example.com' },
        session: null,
      },
      error: null,
    });
    insertSpy.mockResolvedValue({ data: [], error: null });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  const openDialog = async () => {
    const user = userEvent.setup();
    render(<CreateClient label="Crear Cliente" />);
    await user.click(
      screen.getAllByRole('button', { name: /crear cliente/i })[0],
    );
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /crear cliente/i }),
      ).toBeInTheDocument();
    });
  };

  it('should render the trigger button with the provided label', () => {
    render(<CreateClient label="Add New Client" />);
    expect(
      screen.getByRole('button', { name: /add new client/i }),
    ).toBeInTheDocument();
  });

  it('should open and close the dialog', async () => {
    const user = userEvent.setup();
    render(<CreateClient label="Crear Cliente" />);

    await user.click(screen.getByRole('button', { name: /crear cliente/i }));
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /crear cliente/i }),
      ).toBeInTheDocument();
    });
    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(
        screen.queryByRole('heading', { name: /crear cliente/i }),
      ).not.toBeInTheDocument();
    });
  });

  it('should toggle password visibility', async () => {
    await openDialog();
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const toggleButton = screen.getByRole('button', {
      name: 'Mostrar/ocultar',
    });
    const user = userEvent.setup();

    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should display validation errors for empty fields on submit', async () => {
    await openDialog();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /crear cuenta/i }));

    await waitFor(() => {
      expect(screen.getByText('Nombre requerido')).toBeInTheDocument();
      expect(screen.getByText('Correo inválido')).toBeInTheDocument();
      expect(screen.getByText('Teléfono inválido')).toBeInTheDocument();
      expect(screen.getByText('Mínimo 6 caracteres')).toBeInTheDocument();
    });

    expect(signUpSpy).not.toHaveBeenCalled();
    expect(insertSpy).not.toHaveBeenCalled();
  });

  it('should clear validation error on input change', async () => {
    await openDialog();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /crear cuenta/i }));
    await waitFor(() => {
      expect(screen.getByText('Nombre requerido')).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/nombre completo/i), 'Test Name');
    expect(screen.queryByText('Nombre requerido')).not.toBeInTheDocument();
  });

  it('should display validation error for invalid email', async () => {
    await openDialog();
    const user = userEvent.setup();

    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'invalid-email',
    );
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }));
    await waitFor(() => {
      expect(screen.getByText('Correo inválido')).toBeInTheDocument();
    });
  });

  it('should display validation error for invalid phone', async () => {
    await openDialog();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/teléfono/i), '123');
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }));
    await waitFor(() => {
      expect(screen.getByText('Teléfono inválido')).toBeInTheDocument();
    });
  });

  it('should display validation error for short password', async () => {
    await openDialog();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/contraseña/i), 'short');
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }));
    await waitFor(() => {
      expect(screen.getByText('Mínimo 6 caracteres')).toBeInTheDocument();
    });
  });

  it('should call Supabase signUp and insert user on valid submission', async () => {
    await openDialog();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/nombre completo/i), 'John Doe');
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'john.doe@example.com',
    );
    await user.type(screen.getByLabelText(/teléfono/i), '1234567890');
    await user.type(screen.getByLabelText(/contraseña/i), 'password123');

    await user.click(screen.getByRole('button', { name: 'Crear Cuenta' }));

    await waitFor(() => {
      expect(signUpSpy).toHaveBeenCalledTimes(1);
      expect(signUpSpy).toHaveBeenCalledWith({
        email: 'john.doe@example.com',
        password: 'password123',
        options: {
          data: {
            name: 'John Doe',
            phone: '1234567890',
          },
        },
      });
    });

    await waitFor(() => {
      expect(fromSpy).toHaveBeenCalledWith('users');
      expect(insertSpy).toHaveBeenCalledTimes(1);
      expect(insertSpy).toHaveBeenCalledWith({
        id: 'test-user-id',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
      });
    });

    await waitFor(() => {
      expect(
        screen.queryByRole('heading', { name: /crear cliente/i }),
      ).not.toBeInTheDocument();
    });
    await openDialog();
    expect(screen.getByLabelText(/nombre completo/i)).toHaveValue('');
    expect(screen.getByLabelText(/correo electrónico/i)).toHaveValue('');
    expect(screen.getByLabelText(/teléfono/i)).toHaveValue('');
    expect(screen.getByLabelText(/contraseña/i)).toHaveValue('');
  });

  it('should handle Supabase signUp error', async () => {
    signUpSpy.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: new Error('Supabase signUp error'),
    });

    await openDialog();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/nombre completo/i), 'John Doe');
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'john.doe@example.com',
    );
    await user.type(screen.getByLabelText(/teléfono/i), '1234567890');
    await user.type(screen.getByLabelText(/contraseña/i), 'password123');

    await user.click(screen.getByRole('button', { name: 'Crear Cuenta' }));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error al crear usuario:',
        expect.any(Error),
      );
    });

    expect(
      screen.getByRole('heading', { name: /crear cliente/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Crear Cuenta' }),
    ).not.toBeDisabled();
    expect(insertSpy).not.toHaveBeenCalled();
  });

  it('should handle Supabase insert error', async () => {
    insertSpy.mockResolvedValueOnce({
      data: null,
      error: new Error('Supabase insert error'),
    });

    await openDialog();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/nombre completo/i), 'John Doe');
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'john.doe@example.com',
    );
    await user.type(screen.getByLabelText(/teléfono/i), '1234567890');
    await user.type(screen.getByLabelText(/contraseña/i), 'password123');

    await user.click(screen.getByRole('button', { name: 'Crear Cuenta' }));

    await waitFor(() => {
      expect(signUpSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error al crear usuario:',
        expect.any(Error),
      );
    });

    expect(
      screen.getByRole('heading', { name: /crear cliente/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Crear Cuenta' }),
    ).not.toBeDisabled();
  });
});
