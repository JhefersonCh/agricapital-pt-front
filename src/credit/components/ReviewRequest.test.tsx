/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReviewRequest } from '../components/ReviewRequest';
import { RequestService } from '../services/requestService';

vi.mock('../services/requestService', () => {
  const mockGetRelatedData = vi.fn(() =>
    Promise.resolve({
      data: {
        credit_types: [
          { id: '1', name: 'Agrícola' },
          { id: '2', name: 'Ganadero' },
        ],
        request_statuses: [
          { id: 'pending', name: 'Pendiente' },
          { id: 'approved', name: 'Aprobado' },
        ],
      },
    }),
  );
  return {
    RequestService: vi.fn(() => ({
      getRelatedData: mockGetRelatedData,
    })),
  };
});

const mockPersonalInfo = {
  date_of_birth: new Date('1990-05-15'),
  address_line1: 'Calle Falsa 123',
  address_city: 'Springfield',
  address_region: 'Centro',
  address_postal_code: '12345',
  annual_income: 50000000,
  years_of_agricultural_experience: 10,
  has_agricultural_insurance: true,
  internal_credit_history_score: 780,
  current_debt_to_income_ratio: 0.25,
  farm_size_hectares: 150,
};

const mockAccountInfo = {
  client_id: 'CLT-ABC-001',
  requested_amount: 10000000,
  term_months: 24,
  annual_interest_rate: 12,
  credit_type_id: '1', // 'Agrícola'
  status_id: 'pending', // 'Pendiente'
  purpose_description: 'Comprar nueva maquinaria agrícola',
  applicant_contribution_amount: 2000000,
  collateral_offered_description: 'Terreno de 50 hectáreas',
};

describe('ReviewRequest', () => {
  let mockOnPrevious: () => void;
  let mockOnSubmit: () => void;
  let mockRequestService: RequestService;

  beforeEach(() => {
    mockOnPrevious = vi.fn();
    mockOnSubmit = vi.fn();
    vi.clearAllMocks();
    mockRequestService = new RequestService();
  });

  it('renders correctly with given personal and account info', async () => {
    render(
      <ReviewRequest
        personalInfo={mockPersonalInfo}
        accountInfo={mockAccountInfo}
        onPrevious={mockOnPrevious}
        onSubmit={mockOnSubmit}
      />,
    );

    expect(
      screen.getByText('Resumen de Solicitud de Crédito'),
    ).toBeInTheDocument();
    expect(screen.getByText(/Fecha de Nacimiento/i)).toBeInTheDocument();
    expect(screen.getByText('14 de mayo de 1990')).toBeInTheDocument();
    expect(screen.getByText('(35 años)')).toBeInTheDocument();
    expect(
      screen.getByText(mockPersonalInfo.address_line1),
    ).toBeInTheDocument();
    expect(screen.getByText(/Springfield, Centro 12345/i)).toBeInTheDocument();
    expect(screen.getByText(mockAccountInfo.client_id)).toBeInTheDocument();

    expect(screen.getByText('Ingreso Anual')).toBeInTheDocument();
    expect(screen.getByText('Ratio Deuda/Ingreso')).toBeInTheDocument();
    expect(screen.getByText('25.0%')).toBeInTheDocument();
    expect(screen.getByText('Saludable')).toBeInTheDocument();
    expect(screen.getByText('Puntaje Crediticio')).toBeInTheDocument();
    expect(screen.getByText('780')).toBeInTheDocument();
    expect(screen.getByText('Excelente')).toBeInTheDocument();

    expect(screen.getByText('Experiencia')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('años en agricultura')).toBeInTheDocument();
    expect(screen.getByText('Tamaño de Granja')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('hectáreas')).toBeInTheDocument();
    expect(screen.getByText('Seguro Agrícola')).toBeInTheDocument();
    expect(screen.getByText('Asegurado')).toBeInTheDocument();
    expect(screen.getByText('Nivel de Riesgo')).toBeInTheDocument();
    expect(screen.getByText('Bajo')).toBeInTheDocument();

    expect(screen.getByText('Monto Solicitado')).toBeInTheDocument();
    expect(screen.getByText('Plazo')).toBeInTheDocument();
    expect(screen.getByText('24 meses')).toBeInTheDocument();
    expect(screen.getByText('Tasa Anual')).toBeInTheDocument();
    expect(screen.getByText('12.0%')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockRequestService.getRelatedData).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Agrícola')).toBeInTheDocument();
      expect(screen.getByText('Pendiente')).toBeInTheDocument();
    });

    expect(screen.getByText('Aporte Propio')).toBeInTheDocument();

    expect(screen.getByText('Cuota Mensual:')).toBeInTheDocument();
    expect(screen.getByText('$ 470.735')).toBeInTheDocument();
    expect(screen.getByText('% del Ingreso Mensual:')).toBeInTheDocument();
    expect(screen.getByText('11.3%')).toBeInTheDocument();

    expect(screen.getByText('Propósito del Crédito')).toBeInTheDocument();
    expect(
      screen.getByText('Comprar nueva maquinaria agrícola'),
    ).toBeInTheDocument();
    expect(screen.getByText('Garantía Ofrecida')).toBeInTheDocument();
    expect(screen.getByText('Terreno de 50 hectáreas')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /Editar Información/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Finalizar/i }),
    ).toBeInTheDocument();
  });

  it('calls onPrevious when "Editar Información" button is clicked', async () => {
    render(
      <ReviewRequest
        personalInfo={mockPersonalInfo}
        accountInfo={mockAccountInfo}
        onPrevious={mockOnPrevious}
        onSubmit={mockOnSubmit}
      />,
    );

    const previousButton = screen.getByRole('button', {
      name: /Editar Información/i,
    });
    fireEvent.click(previousButton);
    expect(mockOnPrevious).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit when "Finalizar" button is clicked', async () => {
    render(
      <ReviewRequest
        personalInfo={mockPersonalInfo}
        accountInfo={mockAccountInfo}
        onPrevious={mockOnPrevious}
        onSubmit={mockOnSubmit}
      />,
    );

    const submitButton = screen.getByRole('button', { name: /Finalizar/i });
    fireEvent.click(submitButton);
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('handles zero requested amount and calculates monthly payment as 0', async () => {
    const zeroAmountAccountInfo = { ...mockAccountInfo, requested_amount: 0 };
    render(
      <ReviewRequest
        personalInfo={mockPersonalInfo}
        accountInfo={zeroAmountAccountInfo}
        onPrevious={mockOnPrevious}
        onSubmit={mockOnSubmit}
      />,
    );

    await waitFor(() => {
      expect(mockRequestService.getRelatedData).toHaveBeenCalledTimes(1);
    });
  });

  it('displays "No especificado" for null or invalid date of birth', async () => {
    const personalInfoWithNullDate = {
      ...mockPersonalInfo,
      date_of_birth: null,
    };
    render(
      <ReviewRequest
        personalInfo={personalInfoWithNullDate}
        accountInfo={mockAccountInfo}
        onPrevious={mockOnPrevious}
        onSubmit={mockOnSubmit}
      />,
    );
    await waitFor(() => {
      expect(mockRequestService.getRelatedData).toHaveBeenCalledTimes(1);
    });
    expect(screen.getAllByText('No especificado')[0]).toBeInTheDocument();
  });

  it('displays "Fecha inválida" for invalid date string', async () => {
    const personalInfoWithInvalidDate = {
      ...mockPersonalInfo,
      date_of_birth: 'invalid-date' as any,
    };
    render(
      <ReviewRequest
        personalInfo={personalInfoWithInvalidDate}
        accountInfo={mockAccountInfo}
        onPrevious={mockOnPrevious}
        onSubmit={mockOnSubmit}
      />,
    );
    await waitFor(() => {
      expect(mockRequestService.getRelatedData).toHaveBeenCalledTimes(1);
    });
    expect(screen.getAllByText('Fecha inválida')[0]).toBeInTheDocument();
  });

  it('correctly calculates and displays risk level (Medium)', async () => {
    const personalInfoMediumRisk = {
      ...mockPersonalInfo,
      has_agricultural_insurance: false,
      years_of_agricultural_experience: 3,
      internal_credit_history_score: 680,
      current_debt_to_income_ratio: 0.35,
      annual_income: 10_000_000,
    };
    const accountInfoMediumRisk = {
      ...mockAccountInfo,
      requested_amount: 1_000_000,
      annual_interest_rate: 15,
      term_months: 12,
    };

    render(
      <ReviewRequest
        personalInfo={personalInfoMediumRisk}
        accountInfo={accountInfoMediumRisk}
        onPrevious={mockOnPrevious}
        onSubmit={mockOnSubmit}
      />,
    );
    await waitFor(() => {
      expect(mockRequestService.getRelatedData).toHaveBeenCalledTimes(1);
    });
  });

  it('correctly calculates and displays risk level (High)', async () => {
    const personalInfoHighRisk = {
      ...mockPersonalInfo,
      has_agricultural_insurance: false,
      years_of_agricultural_experience: 1,
      internal_credit_history_score: 600,
      current_debt_to_income_ratio: 0.5,
      annual_income: 10_000_000,
    };
    const accountInfoHighRisk = {
      ...mockAccountInfo,
      requested_amount: 5_000_000,
      annual_interest_rate: 20,
      term_months: 12,
    };

    render(
      <ReviewRequest
        personalInfo={personalInfoHighRisk}
        accountInfo={accountInfoHighRisk}
        onPrevious={mockOnPrevious}
        onSubmit={mockOnSubmit}
      />,
    );
    await waitFor(() => {
      expect(mockRequestService.getRelatedData).toHaveBeenCalledTimes(1);
    });
  });

  it('does not render additional info cards if purpose_description and collateral_offered_description are empty', async () => {
    const accountInfoNoAdditional = {
      ...mockAccountInfo,
      purpose_description: '',
      collateral_offered_description: '',
    };
    render(
      <ReviewRequest
        personalInfo={mockPersonalInfo}
        accountInfo={accountInfoNoAdditional}
        onPrevious={mockOnPrevious}
        onSubmit={mockOnSubmit}
      />,
    );

    await waitFor(() => {
      expect(mockRequestService.getRelatedData).toHaveBeenCalledTimes(1);
    });

    expect(screen.queryByText('Propósito del Crédito')).not.toBeInTheDocument();
    expect(screen.queryByText('Garantía Ofrecida')).not.toBeInTheDocument();
  });
});
