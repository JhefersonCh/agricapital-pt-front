/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReviewCredit } from './ReviewCredit';
import { RequestService } from '../services/requestService';
import { ClientProfileService } from '../services/clientProfileService';

vi.mock('../services/requestService');
vi.mock('../services/clientProfileService');

const mockRequest = {
  id: 'req123',
  client_id: 'client456',
  requested_amount: 1000000,
  term_months: 12,
  annual_interest_rate: 0.1,
  credit_type_id: 'creditType1',
  status_id: 'd4e5f6a7-b8c9-4902-def0-4567890123de',
  approved_amount: 0,
  approved_at: null,
  analyst_id: null,
  rejection_reason: null,
  risk_score: 55,
  risk_assessment_details: {
    monthly_payment: 90000,
    age_calculated: 30,
    weights_applied: {},
    final_risk_score: 55,
    scores_by_category: {
      collateral: 60,
      debt_burden: 50,
      demographics: 70,
      credit_history: 40,
      payment_capacity: 65,
      agricultural_profile: 75,
      loan_characteristics: 55,
    },
    total_positive_score: 100,
    payment_to_income_ratio: 0.15,
  },
  purpose_description: 'Comprar equipo agrícola',
  applicant_contribution_amount: 100000,
  collateral_offered_description: 'Tractor John Deere',
  collateral_value: 1200000,
  number_of_dependents: 2,
  other_income_sources: 500000,
  previous_defaults: 0,
  created_at: new Date('2024-01-01T10:00:00Z'),
  updated_at: new Date('2024-01-01T10:00:00Z'),
  credit_type: {
    name: 'Crédito Agrícola',
    description: 'Crédito para actividades agrícolas',
    code: 'AGRICOLA',
    updated_at: new Date(),
    id: 'creditType1',
    is_active: true,
    created_at: new Date(),
  },
  status: {
    name: 'Pendiente',
    description:
      'La solicitud ha sido enviada y está en espera de revisión inicial.',
    code: 'PENDING',
    updated_at: new Date(),
    id: 'd4e5f6a7-b8c9-4902-def0-4567890123de',
    is_active: true,
    created_at: new Date(),
  },
};

const mockClientProfile = {
  user_id: 'client456',
  date_of_birth: new Date('1990-05-15T00:00:00Z'),
  address_line1: 'Calle Falsa 123',
  address_city: 'Springfield',
  address_region: 'Oregon',
  address_postal_code: '97477',
  annual_income: 80000000,
  years_of_agricultural_experience: 10,
  has_agricultural_insurance: true,
  internal_credit_history_score: 750,
  current_debt_to_income_ratio: 0.2,
  farm_size_hectares: 50,
  created_at: new Date(),
  updated_at: new Date(),
};

const mockRequestStatuses = [
  {
    description:
      'La solicitud ha sido enviada y está en espera de revisión inicial.',
    name: 'Pendiente',
    code: 'PENDING',
    created_at: '2025-05-29T20:16:06.430998',
    updated_at: '2025-05-29T20:16:06.430998',
    id: 'd4e5f6a7-b8c9-4902-def0-4567890123de',
    is_active: true,
  },
  {
    description: 'La solicitud está siendo evaluada por un analista.',
    name: 'En Revisión',
    code: 'REVIEWING',
    created_at: '2025-05-29T20:16:06.430998',
    updated_at: '2025-05-29T20:16:06.430998',
    id: 'e5f6a7b8-c9d0-4903-ef12-5678901234ef',
    is_active: true,
  },
  {
    description:
      'La solicitud ha sido aprobada y el desembolso está pendiente.',
    name: 'Aprobada',
    code: 'APPROVED',
    created_at: '2025-05-29T20:16:06.430998',
    updated_at: '2025-05-29T20:16:06.430998',
    id: 'f6a7b8c9-d0e1-4904-f234-6789012345fa',
    is_active: true,
  },
  {
    description:
      'La solicitud no cumple con los criterios y ha sido rechazada.',
    name: 'Rechazada',
    code: 'REJECTED',
    created_at: '2025-05-29T20:16:06.430998',
    updated_at: '2025-05-29T20:16:06.430998',
    id: '01a2b3c4-d5e6-4905-1234-789012345601',
    is_active: true,
  },
  {
    description: 'El monto aprobado ha sido entregado al cliente.',
    name: 'Desembolsada',
    code: 'DISBURSED',
    created_at: '2025-05-29T20:16:06.430998',
    updated_at: '2025-05-29T20:16:06.430998',
    id: '12b3c4d5-e6f7-4906-2345-890123456712',
    is_active: true,
  },
  {
    description:
      'La solicitud fue cancelada por el cliente o por decisión interna antes de la aprobación.',
    name: 'Cancelada',
    code: 'CANCELLED',
    created_at: '2025-05-29T20:16:06.430998',
    updated_at: '2025-05-29T20:16:06.430998',
    id: '23c4d5e6-f7a8-4907-3456-901234567823',
    is_active: true,
  },
];

describe('ReviewCredit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(RequestService).mockImplementation(
      () =>
        ({
          getRequestById: vi.fn().mockResolvedValue({ data: mockRequest }),
          getRelatedData: vi.fn().mockResolvedValue({
            data: { request_statuses: mockRequestStatuses },
          }),
          approveRequest: vi.fn().mockResolvedValue({}),
          rejectRequest: vi.fn().mockResolvedValue({}),
          changeRequestStatus: vi.fn().mockResolvedValue({}),
        } as any),
    );

    vi.mocked(ClientProfileService).mockImplementation(
      () =>
        ({
          getClientProfile: vi
            .fn()
            .mockResolvedValue({ data: mockClientProfile }),
        } as any),
    );
  });

  it('renders the trigger button', () => {
    render(<ReviewCredit label="Revisar Crédito" requestId="1" clientId="1" />);
    expect(
      screen.getByRole('button', { name: /revisar crédito/i }),
    ).toBeInTheDocument();
  });

  it('loads and displays request and client data when dialog is opened', async () => {
    render(
      <ReviewCredit
        label="Revisar Crédito"
        requestId="req123"
        clientId="client456"
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /revisar crédito/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/revisión de solicitud de crédito/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/id: req123/i)).toBeInTheDocument();
      expect(screen.getByText(/tractor john deere/i)).toBeInTheDocument();
      expect(screen.getByText(/calle falsa 123/i)).toBeInTheDocument();
    });
  });

  it('shows rejection reason input when status is "Rechazada" and calls rejectRequest', async () => {
    render(
      <ReviewCredit
        label="Revisar Crédito"
        requestId="req123"
        clientId="client456"
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /revisar crédito/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/revisión de solicitud de crédito/i),
      ).toBeInTheDocument();
    });

    fireEvent.mouseDown(
      screen.getByRole('combobox', { name: /selecciona un estado/i }),
    );
    fireEvent.click(screen.getByRole('button', { name: /actualizar estado/i }));

    expect(
      screen.getByRole('button', { name: /actualizar estado/i }),
    ).toBeDisabled();
  });

  it('shows approved amount input when status is "Aprobada" and calls approveRequest', async () => {
    render(
      <ReviewCredit
        label="Revisar Crédito"
        requestId="req123"
        clientId="client456"
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /revisar crédito/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/revisión de solicitud de crédito/i),
      ).toBeInTheDocument();
    });

    fireEvent.mouseDown(
      screen.getByRole('combobox', { name: /selecciona un estado/i }),
    );

    fireEvent.click(screen.getByRole('button', { name: /actualizar estado/i }));
    expect(
      screen.getByRole('button', { name: /actualizar estado/i }),
    ).toBeDisabled();
  });

  it('disables update button if selected status is the same as current status', async () => {
    vi.mocked(RequestService).mockImplementation(
      () =>
        ({
          getRequestById: vi.fn().mockResolvedValue({
            data: {
              ...mockRequest,
              status_id: 'f6a7b8c9-d0e1-4904-f234-6789012345fa',
              status: {
                name: 'Aprobada',
                description:
                  'La solicitud ha sido aprobada y el desembolso está pendiente.',
                code: 'APPROVED',
                updated_at: new Date(),
                id: 'f6a7b8c9-d0e1-4904-f234-6789012345fa',
                is_active: true,
                created_at: new Date(),
              },
            },
          }),
          getRelatedData: vi.fn().mockResolvedValue({
            data: { request_statuses: mockRequestStatuses },
          }),
          approveRequest: vi.fn().mockResolvedValue({}),
          rejectRequest: vi.fn().mockResolvedValue({}),
          changeRequestStatus: vi.fn().mockResolvedValue({}),
        } as any),
    );

    render(
      <ReviewCredit
        label="Revisar Crédito"
        requestId="req123"
        clientId="client456"
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /revisar crédito/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/revisión de solicitud de crédito/i),
      ).toBeInTheDocument();
    });

    const updateButton = screen.getByRole('button', {
      name: /actualizar estado/i,
    });
    expect(updateButton).toBeDisabled();
  });
});
