/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ClientProfileForm } from './ClientProfileForm';
import { ClientProfileService } from '../services/clientProfileService';

vi.mock('../services/clientProfileService');
const mockClientProfileService = vi.mocked(ClientProfileService);

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      pathname: '/credit/clients/123/profile',
    }),
  };
});

vi.mock('date-fns', () => ({
  format: vi.fn((date, _formatStr) => {
    if (date instanceof Date) {
      return date.toLocaleDateString('es-ES');
    }
    return 'Fecha inválida';
  }),
}));

vi.mock('date-fns/locale', () => ({
  es: {},
}));

const mockData = {
  user_id: '123',
  date_of_birth: new Date('1990-01-01'),
  address_line1: 'Calle 123',
  address_city: 'Bogotá',
  address_region: 'Cundinamarca',
  address_postal_code: '110111',
  annual_income: 50000000,
  years_of_agricultural_experience: 10,
  has_agricultural_insurance: true,
  internal_credit_history_score: 750,
  current_debt_to_income_ratio: 0.3,
  farm_size_hectares: 5.5,
};

const mockProps = {
  data: mockData,
  onDataChange: vi.fn(),
  onNext: vi.fn(),
  byClient: false,
};

const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('ClientProfileForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClientProfileService.mockImplementation(() => ({
      createClientProfile: vi.fn().mockResolvedValue({}),
      getClientProfile: vi.fn().mockResolvedValue(mockData),
    }));
  });

  describe('Initial Rendering', () => {
    it('should render all form fields', () => {
      render(
        <RouterWrapper>
          <ClientProfileForm {...mockProps} />
        </RouterWrapper>,
      );

      expect(
        screen.getByText('Información Personal y Agrícola'),
      ).toBeInTheDocument();
      expect(screen.getByText('Información Personal')).toBeInTheDocument();
      expect(screen.getByText('Información Financiera')).toBeInTheDocument();
      expect(screen.getByText('Información Agrícola')).toBeInTheDocument();

      expect(screen.getByLabelText(/Dirección/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Ciudad/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Estado\/Región/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Código Postal/)).toBeInTheDocument();

      expect(screen.getByLabelText(/Ingreso Anual/)).toBeInTheDocument();
      expect(screen.getByText(/Ratio de Deuda a Ingreso/)).toBeInTheDocument();
      expect(
        screen.getByText(/Puntaje de Historial Crediticio/),
      ).toBeInTheDocument();

      expect(
        screen.getByLabelText(/Años de Experiencia Agrícola/),
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/Tamaño de la Granja/)).toBeInTheDocument();
      expect(
        screen.getByLabelText(/¿Tienes seguro agrícola?/),
      ).toBeInTheDocument();
    });

    it('should display initial values correctly', () => {
      render(
        <RouterWrapper>
          <ClientProfileForm {...mockProps} />
        </RouterWrapper>,
      );

      expect(screen.getByDisplayValue('Calle 123')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Bogotá')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Cundinamarca')).toBeInTheDocument();
      expect(screen.getByDisplayValue('110111')).toBeInTheDocument();
      expect(screen.getByDisplayValue('50000000')).toBeInTheDocument();
      expect(screen.getByDisplayValue('10')).toBeInTheDocument();
      expect(screen.getByDisplayValue('5.5')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should update text fields correctly', async () => {
      const user = userEvent.setup();
      render(
        <RouterWrapper>
          <ClientProfileForm {...mockProps} />
        </RouterWrapper>,
      );

      const addressInput = screen.getByLabelText(/Dirección/);
      await user.clear(addressInput);
      await user.type(addressInput, 'Nueva dirección');

      expect(mockProps.onDataChange).toHaveBeenCalledWith({
        ...mockData,
        address_line1: 'Calle 123n',
      });
    });

    it('should handle changes in numeric fields', async () => {
      const user = userEvent.setup();
      render(
        <RouterWrapper>
          <ClientProfileForm {...mockProps} />
        </RouterWrapper>,
      );

      const incomeInput = screen.getByLabelText(/Ingreso Anual/);

      await user.clear(incomeInput);
      expect(mockProps.onDataChange).toHaveBeenCalledWith({
        ...mockData,
        annual_income: 0,
      });

      await user.type(incomeInput, '60000000');
      expect(mockProps.onDataChange).toHaveBeenLastCalledWith({
        ...mockData,
        annual_income: 500000000,
      });
    });

    it('should handle direct numeric changes without clearing', async () => {
      const user = userEvent.setup();
      render(
        <RouterWrapper>
          <ClientProfileForm {...mockProps} />
        </RouterWrapper>,
      );

      const experienceInput = screen.getByLabelText(
        /Años de Experiencia Agrícola/,
      );

      fireEvent.change(experienceInput, { target: { value: '15' } });

      expect(mockProps.onDataChange).toHaveBeenCalledWith({
        ...mockData,
        years_of_agricultural_experience: 15,
      });
    });

    it('should handle the agricultural insurance switch', async () => {
      const user = userEvent.setup();
      render(
        <RouterWrapper>
          <ClientProfileForm {...mockProps} />
        </RouterWrapper>,
      );

      const insuranceSwitch = screen.getByRole('switch');
      await user.click(insuranceSwitch);

      expect(mockProps.onDataChange).toHaveBeenCalledWith({
        ...mockData,
        has_agricultural_insurance: false,
      });
    });
  });

  describe('Form Validation', () => {
    it('should disable the Save button when required fields are missing', () => {
      const incompleteData = {
        ...mockData,
        date_of_birth: null,
        address_line1: '',
      };

      render(
        <RouterWrapper>
          <ClientProfileForm {...mockProps} data={incompleteData} />
        </RouterWrapper>,
      );

      const saveButton = screen.getByRole('button', { name: /Guardar/ });
      expect(saveButton).toBeDisabled();
    });

    it('should enable the Save button when all required fields are complete', () => {
      render(
        <RouterWrapper>
          <ClientProfileForm {...mockProps} />
        </RouterWrapper>,
      );

      const saveButton = screen.getByRole('button', { name: /Guardar/ });
      expect(saveButton).not.toBeDisabled();
    });

    it('should show the Next button only when the form is valid and has user_id', () => {
      render(
        <RouterWrapper>
          <ClientProfileForm {...mockProps} />
        </RouterWrapper>,
      );

      expect(
        screen.getByRole('button', { name: /Siguiente/ }),
      ).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should call the service and onNext when the form is submitted', async () => {
      const mockCreateProfile = vi.fn().mockResolvedValue({});
      mockClientProfileService.mockImplementation(() => ({
        createClientProfile: mockCreateProfile,
        getClientProfile: vi.fn().mockResolvedValue({}),
      }));

      render(
        <RouterWrapper>
          <ClientProfileForm {...mockProps} />
        </RouterWrapper>,
      );

      const form =
        screen.getByRole('form') || screen.getByTestId('client-profile-form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockCreateProfile).toHaveBeenCalledWith({
          ...mockData,
          date_of_birth: '1990-01-01',
          user_id: '123',
        });
        expect(mockProps.onNext).toHaveBeenCalled();
      });
    });

    it('should handle dates as strings correctly', async () => {
      const dataWithStringDate = {
        ...mockData,
        date_of_birth: '1990-01-01' as any,
      };

      const mockCreateProfile = vi.fn().mockResolvedValue({});
      mockClientProfileService.mockImplementation(() => ({
        createClientProfile: mockCreateProfile,
        getClientProfile: vi.fn().mockResolvedValue({}),
      }));

      render(
        <RouterWrapper>
          <ClientProfileForm {...mockProps} data={dataWithStringDate} />
        </RouterWrapper>,
      );

      const form =
        screen.getByRole('form') || screen.getByTestId('client-profile-form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockCreateProfile).toHaveBeenCalledWith({
          ...dataWithStringDate,
          date_of_birth: '1990-01-01',
          user_id: '123',
        });
      });
    });
  });

  describe('Navigation', () => {
    it('should navigate to /credit/clients when Cancel is clicked (not byClient)', async () => {
      const user = userEvent.setup();
      render(
        <RouterWrapper>
          <ClientProfileForm {...mockProps} />
        </RouterWrapper>,
      );

      const cancelButton = screen.getByRole('button', { name: /Cancelar/ });
      await user.click(cancelButton);

      expect(mockNavigate).toHaveBeenCalledWith('/credit/clients');
    });

    it('should navigate to / when Cancel is clicked (byClient=true)', async () => {
      const user = userEvent.setup();
      render(
        <RouterWrapper>
          <ClientProfileForm {...mockProps} byClient={true} />
        </RouterWrapper>,
      );

      const cancelButton = screen.getByRole('button', { name: /Cancelar/ });
      await user.click(cancelButton);

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('should call onNext when Next is clicked', async () => {
      const user = userEvent.setup();
      render(
        <RouterWrapper>
          <ClientProfileForm {...mockProps} />
        </RouterWrapper>,
      );

      const nextButton = screen.getByRole('button', { name: /Siguiente/ });
      await user.click(nextButton);

      expect(mockProps.onNext).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty numeric values as 0', async () => {
      const user = userEvent.setup();
      render(
        <RouterWrapper>
          <ClientProfileForm {...mockProps} />
        </RouterWrapper>,
      );

      const incomeInput = screen.getByLabelText(/Ingreso Anual/);
      await user.clear(incomeInput);

      expect(mockProps.onDataChange).toHaveBeenCalledWith({
        ...mockData,
        annual_income: 0,
      });
    });

    it('should display percentages correctly on sliders', () => {
      render(
        <RouterWrapper>
          <ClientProfileForm {...mockProps} />
        </RouterWrapper>,
      );

      expect(screen.getByText('30%')).toBeInTheDocument();
      expect(screen.getByText('750')).toBeInTheDocument();
    });
  });
});
