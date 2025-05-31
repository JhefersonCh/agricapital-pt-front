import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CreditRequestForm } from './CreditRequestForm';
import { MemoryRouter } from 'react-router-dom';

const mockCreateRequest = vi.fn();
const mockGetRelatedData = vi.fn();

vi.mock('../services/requestService', () => ({
  RequestService: vi.fn(() => ({
    createRequest: mockCreateRequest,
    getRelatedData: mockGetRelatedData,
  })),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useLocation: () => ({
      pathname: '/credits/client/client123',
    }),
  };
});

const initialData = {
  client_id: 'client123',
  requested_amount: 0,
  term_months: 0,
  annual_interest_rate: 0,
  credit_type_id: '',
  status_id: '',
  purpose_description: '',
  applicant_contribution_amount: 0,
  collateral_offered_description: '',
  collateral_value: 0,
  number_of_dependents: 0,
  other_income_sources: 0,
  previous_defaults: false,
};

describe('CreditRequestForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetRelatedData.mockResolvedValue({
      data: {
        credit_types: [
          { id: 'type1', name: 'Préstamo Agrícola' },
          { id: 'type2', name: 'Crédito Ganadero' },
        ],
        request_statuses: [
          { id: 'status1', name: 'Pendiente' },
          { id: 'status2', name: 'Aprobado' },
        ],
      },
    });
  });

  it('renders the form correctly with initial data', async () => {
    render(
      <MemoryRouter>
        <CreditRequestForm
          data={initialData}
          onDataChange={vi.fn()}
          onNext={vi.fn()}
          onPrevious={vi.fn()}
        />
      </MemoryRouter>,
    );

    expect(screen.getByTitle('Información del Crédito')).toBeInTheDocument();
    expect(screen.getByLabelText(/id del cliente/i)).toHaveValue('client123');
    expect(screen.getByLabelText(/monto solicitado/i)).toHaveValue(0);
    expect(screen.getByLabelText(/plazo en meses/i)).toHaveValue(null);
    expect(
      screen.getByPlaceholderText(/describe para qué necesitas el crédito/i),
    ).toBeInTheDocument();

    expect(screen.getByTitle('Selecciona tipo de crédito')).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.getByTitle('Selecciona tipo de crédito'),
      ).toBeInTheDocument();
      expect(screen.getByTitle('Selecciona estado')).toBeInTheDocument();
    });
  });

  it('calls onDataChange when input fields are changed', () => {
    const handleDataChange = vi.fn();
    render(
      <MemoryRouter>
        <CreditRequestForm
          data={initialData}
          onDataChange={handleDataChange}
          onNext={vi.fn()}
          onPrevious={vi.fn()}
        />
      </MemoryRouter>,
    );

    const requestedAmountInput = screen.getByLabelText(/monto solicitado/i);
    fireEvent.change(requestedAmountInput, { target: { value: '5000' } });
    expect(handleDataChange).toHaveBeenCalledWith(
      expect.objectContaining({ requested_amount: 5000 }),
    );

    const termMonthsInput = screen.getByLabelText(/plazo en meses/i);
    fireEvent.change(termMonthsInput, { target: { value: '24' } });
    expect(handleDataChange).toHaveBeenCalledWith(
      expect.objectContaining({ term_months: 24 }),
    );

    const purposeDescriptionTextarea = screen.getByLabelText(
      /propósito del crédito/i,
    );
    fireEvent.change(purposeDescriptionTextarea, {
      target: { value: 'Para comprar un tractor.' },
    });
    expect(handleDataChange).toHaveBeenCalledWith(
      expect.objectContaining({
        purpose_description: 'Para comprar un tractor.',
      }),
    );

    const previousDefaultsCheckbox = screen.getByLabelText(
      /has tenido incumplimientos anteriores/i,
    );
    fireEvent.click(previousDefaultsCheckbox);
    expect(handleDataChange).toHaveBeenCalledWith(
      expect.objectContaining({ previous_defaults: true }),
    );
  });

  it('displays the estimated monthly payment when amount and term are provided', async () => {
    const dataWithValues = {
      ...initialData,
      requested_amount: 10000,
      term_months: 60,
      annual_interest_rate: 0.05,
    };

    render(
      <MemoryRouter>
        <CreditRequestForm
          data={dataWithValues}
          onDataChange={vi.fn()}
          onNext={vi.fn()}
          onPrevious={vi.fn()}
        />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/\$188\.71/i)).toBeInTheDocument();
    });
  });

  it('calls createRequest on form submission when isValid is true', async () => {
    const handleNext = vi.fn();
    const validData = {
      ...initialData,
      requested_amount: 1000,
      term_months: 12,
      credit_type_id: 'type1',
      status_id: 'status2',
    };

    render(
      <MemoryRouter>
        <CreditRequestForm
          data={validData}
          onDataChange={vi.fn()}
          onNext={handleNext}
          onPrevious={vi.fn()}
        />
      </MemoryRouter>,
    );

    mockCreateRequest.mockResolvedValue({});

    const saveButton = screen.getByRole('button', { name: /guardar/i });
    expect(saveButton).toBeEnabled();
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockCreateRequest).toHaveBeenCalledTimes(1);
      expect(mockCreateRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          client_id: 'client123',
          requested_amount: 1000,
          term_months: 12,
          credit_type_id: 'type1',
          status_id: 'status2',
          previous_defaults: false,
        }),
      );
      expect(handleNext).toHaveBeenCalledTimes(1);
    });
  });

  it('sets status_id to "Pendiente" when byClient is true', async () => {
    const handleNext = vi.fn();
    const dataByClient = {
      ...initialData,
      requested_amount: 1000,
      term_months: 12,
      credit_type_id: 'type1',
    };

    render(
      <MemoryRouter>
        <CreditRequestForm
          data={dataByClient}
          onDataChange={vi.fn()}
          onNext={handleNext}
          onPrevious={vi.fn()}
          byClient={true}
        />
      </MemoryRouter>,
    );

    mockCreateRequest.mockResolvedValue({});

    await waitFor(() => {
      expect(
        screen.queryByLabelText(/estado de la solicitud/i),
      ).not.toBeInTheDocument();
    });

    const saveButton = screen.getByRole('button', { name: /guardar/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockCreateRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          status_id: 'status1',
        }),
      );
    });
  });

  it('disables the submit button if required fields are not filled (non-client mode)', async () => {
    const incompleteData = {
      ...initialData,
      requested_amount: 0,
      term_months: 12,
      credit_type_id: 'type1',
      status_id: 'status2',
    };

    render(
      <MemoryRouter>
        <CreditRequestForm
          data={incompleteData}
          onDataChange={vi.fn()}
          onNext={vi.fn()}
          onPrevious={vi.fn()}
        />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /guardar/i })).toBeDisabled();
    });
  });

  it('disables the submit button if required fields are not filled (client mode)', async () => {
    const incompleteData = {
      ...initialData,
      requested_amount: 1000,
      term_months: 0,
      credit_type_id: 'type1',
    };

    render(
      <MemoryRouter>
        <CreditRequestForm
          data={incompleteData}
          onDataChange={vi.fn()}
          onNext={vi.fn()}
          onPrevious={vi.fn()}
          byClient={true}
        />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /guardar/i })).toBeDisabled();
    });
  });

  // ---

  it('calls onPrevious when "Anterior" button is clicked', () => {
    const handlePrevious = vi.fn();
    render(
      <MemoryRouter>
        <CreditRequestForm
          data={initialData}
          onDataChange={vi.fn()}
          onNext={vi.fn()}
          onPrevious={handlePrevious}
        />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: /anterior/i }));
    expect(handlePrevious).toHaveBeenCalledTimes(1);
  });

  it('shows "Siguiente" button only when data is valid and data.id exists', async () => {
    const validDataWithId = {
      ...initialData,
      id: 'some-id',
      requested_amount: 1000,
      term_months: 12,
      credit_type_id: 'type1',
      status_id: 'status2',
    };

    const invalidData = {
      ...initialData,
      id: 'some-id',
      requested_amount: 0,
      term_months: 12,
      credit_type_id: 'type1',
      status_id: 'status2',
    };

    const handleNext = vi.fn();

    const { rerender } = render(
      <MemoryRouter>
        <CreditRequestForm
          data={validDataWithId}
          onDataChange={vi.fn()}
          onNext={handleNext}
          onPrevious={vi.fn()}
        />
      </MemoryRouter>,
    );

    await waitFor(() => {
      const nextButton = screen.getByRole('button', { name: /siguiente/i });
      expect(nextButton).toBeInTheDocument();
      fireEvent.click(nextButton);
      expect(handleNext).toHaveBeenCalledTimes(1);
    });

    rerender(
      <MemoryRouter>
        <CreditRequestForm
          data={invalidData}
          onDataChange={vi.fn()}
          onNext={handleNext}
          onPrevious={vi.fn()}
        />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: /siguiente/i }),
      ).not.toBeInTheDocument();
    });

    const validDataNoId = {
      ...validDataWithId,
      id: undefined,
    };

    rerender(
      <MemoryRouter>
        <CreditRequestForm
          data={validDataNoId}
          onDataChange={vi.fn()}
          onNext={handleNext}
          onPrevious={vi.fn()}
        />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: /siguiente/i }),
      ).not.toBeInTheDocument();
    });
  });
});
