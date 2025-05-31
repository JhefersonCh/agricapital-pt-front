/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RequestByClient } from './RequetByClient';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../components/Steper', () => ({
  Stepper: ({ currentStep, steps }) => (
    <div data-testid="stepper">
      Paso actual: {currentStep} de {steps.length}
    </div>
  ),
}));

vi.mock('../components/ClientProfileForm', () => ({
  ClientProfileForm: ({ onNext, data, onDataChange }) => (
    <div data-testid="client-profile-form">
      ClientProfileForm Mock
      <button onClick={onNext} data-testid="personal-next-button">
        Siguiente Personal
      </button>
      <pre>{JSON.stringify(data)}</pre>
      <input
        data-testid="personal-input-user-id"
        value={data.user_id}
        onChange={(e) => onDataChange({ ...data, user_id: e.target.value })}
      />
    </div>
  ),
}));

vi.mock('../components/CreditRequestForm', () => ({
  CreditRequestForm: ({ onNext, onPrevious, data, onDataChange }) => (
    <div data-testid="credit-request-form">
      CreditRequestForm Mock
      <button onClick={onNext} data-testid="credit-next-button">
        Siguiente Crédito
      </button>
      <button onClick={onPrevious} data-testid="credit-previous-button">
        Anterior Crédito
      </button>
      <pre>{JSON.stringify(data)}</pre>
      <input
        data-testid="credit-input-requested-amount"
        value={data.requested_amount}
        onChange={(e) =>
          onDataChange({
            ...data,
            requested_amount: parseFloat(e.target.value),
          })
        }
      />
    </div>
  ),
}));

vi.mock('../components/ReviewRequest', () => ({
  ReviewRequest: ({ onSubmit, onPrevious, personalInfo, accountInfo }) => (
    <div data-testid="review-request-form">
      ReviewRequest Mock
      <button onClick={onSubmit} data-testid="review-submit-button">
        Enviar Solicitud
      </button>
      <button onClick={onPrevious} data-testid="review-previous-button">
        Anterior Revisión
      </button>
      <pre data-testid="review-personal-info">
        {JSON.stringify(personalInfo)}
      </pre>
      <pre data-testid="review-account-info">{JSON.stringify(accountInfo)}</pre>
    </div>
  ),
}));

const mockGetClientProfile = vi.fn();
const mockGetRequestByClientId = vi.fn();

vi.mock('../services/clientProfileService', () => ({
  ClientProfileService: vi.fn(() => ({
    getClientProfile: mockGetClientProfile,
  })),
}));

vi.mock('../services/requestService', () => ({
  RequestService: vi.fn(() => ({
    getRequestByClientId: mockGetRequestByClientId,
  })),
}));

const mockLocation = {
  pathname: '/credit/clients/some-user-id',
  search: '',
  split: (delimiter: string) => mockLocation.pathname.split(delimiter),
};

const originalLocation = window.location;

describe('RequestByClient', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: mockLocation,
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });

  beforeEach(() => {
    mockNavigate.mockClear();
    mockGetClientProfile.mockClear();
    mockGetRequestByClientId.mockClear();
    mockLocation.search = '';

    mockGetClientProfile.mockResolvedValue({
      data: {
        user_id: 'some-user-id',
        date_of_birth: null,
        address_line1: '123 Test St',
        annual_income: 50000,
      },
    });
    mockGetRequestByClientId.mockResolvedValue({
      data: {
        client_id: 'some-user-id',
        requested_amount: 10000,
        term_months: 12,
      },
    });
  });

  it('renders the initial step (ClientProfileForm) by default', async () => {
    render(<RequestByClient />);

    expect(screen.getByTestId('stepper')).toBeInTheDocument();
    expect(screen.getByTestId('client-profile-form')).toBeInTheDocument();
    expect(screen.queryByTestId('credit-request-form')).not.toBeInTheDocument();
    expect(screen.queryByTestId('review-request-form')).not.toBeInTheDocument();
    await waitFor(() => {
      expect(mockGetClientProfile).toHaveBeenCalledTimes(1);
      expect(mockGetClientProfile).toHaveBeenCalledWith('some-user-id');
    });

    expect(mockNavigate).toHaveBeenCalledWith(
      '/credit/clients/some-user-id?step=0',
      { replace: true },
    );
  });

  it('renders the correct step based on URL query param', async () => {
    mockLocation.search = '?step=1';
    render(<RequestByClient />);

    expect(screen.queryByTestId('client-profile-form')).not.toBeInTheDocument();
    expect(screen.getByTestId('credit-request-form')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockGetRequestByClientId).toHaveBeenCalledTimes(1);
      expect(mockGetRequestByClientId).toHaveBeenCalledWith('some-user-id');
    });

    expect(mockNavigate).toHaveBeenCalledWith(
      '/credit/clients/some-user-id?step=1',
      { replace: true },
    );
  });

  it('navigates to the next step when "Siguiente" is clicked in ClientProfileForm', async () => {
    render(<RequestByClient />);

    await waitFor(() => {
      expect(screen.getByTestId('client-profile-form')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('personal-next-button'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('client-profile-form'),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('credit-request-form')).toBeInTheDocument();
    });

    expect(mockNavigate).toHaveBeenCalledWith(
      '/credit/clients/some-user-id?step=1',
      { replace: true },
    );

    await waitFor(() => {
      expect(mockGetRequestByClientId).toHaveBeenCalledTimes(1);
    });
  });

  it('navigates to the previous step when "Anterior" is clicked in CreditRequestForm', async () => {
    mockLocation.search = '?step=1';
    render(<RequestByClient />);

    await waitFor(() => {
      expect(screen.getByTestId('credit-request-form')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('credit-previous-button'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('credit-request-form'),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('client-profile-form')).toBeInTheDocument();
    });

    expect(mockNavigate).toHaveBeenCalledWith(
      '/credit/clients/some-user-id?step=0',
      { replace: true },
    );

    await waitFor(() => {
      expect(mockGetClientProfile).toHaveBeenCalledTimes(1);
    });
  });

  it('renders ReviewRequest at step 2 and calls both services', async () => {
    mockLocation.search = '?step=2';
    render(<RequestByClient />);

    await waitFor(() => {
      expect(screen.getByTestId('review-request-form')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockGetClientProfile).toHaveBeenCalledTimes(1);
      expect(mockGetRequestByClientId).toHaveBeenCalledTimes(1);
    });

    expect(mockNavigate).toHaveBeenCalledWith(
      '/credit/clients/some-user-id?step=2',
      { replace: true },
    );
  });

  it('calls handleSubmit and navigates to /clients when "Enviar Solicitud" is clicked', async () => {
    mockLocation.search = '?step=2';
    render(<RequestByClient />);

    await waitFor(() => {
      expect(screen.getByTestId('review-request-form')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('review-submit-button'));

    expect(mockNavigate).toHaveBeenCalledWith('/clients');
  });

  it('passes data to ClientProfileForm and CreditRequestForm correctly', async () => {
    mockGetClientProfile.mockResolvedValueOnce({
      data: {
        user_id: 'test-user-123',
        address_line1: 'Mock Address',
        annual_income: 60000,
      },
    });
    mockGetRequestByClientId.mockResolvedValueOnce({
      data: {
        client_id: 'test-user-123',
        requested_amount: 25000,
        term_months: 24,
      },
    });

    render(<RequestByClient />);

    await waitFor(() => {
      const personalInfoDisplay = screen.getByTestId('client-profile-form');
      expect(personalInfoDisplay).toHaveTextContent('test-user-123');
      expect(personalInfoDisplay).toHaveTextContent('Mock Address');
      expect(personalInfoDisplay).toHaveTextContent('60000');
    });

    fireEvent.click(screen.getByTestId('personal-next-button'));

    await waitFor(() => {
      const accountInfoDisplay = screen.getByTestId('credit-request-form');
      expect(accountInfoDisplay).toHaveTextContent('25000');
      expect(accountInfoDisplay).toHaveTextContent('24');
    });

    fireEvent.click(screen.getByTestId('credit-next-button'));

    await waitFor(() => {
      const reviewPersonalInfo = screen.getByTestId('review-personal-info');
      const reviewAccountInfo = screen.getByTestId('review-account-info');

      expect(reviewPersonalInfo).toHaveTextContent('test-user-123');
      expect(reviewPersonalInfo).toHaveTextContent('Mock Address');
      expect(reviewPersonalInfo).toHaveTextContent('60000');

      expect(reviewAccountInfo).toHaveTextContent('25000');
      expect(reviewAccountInfo).toHaveTextContent('24');
    });
  });

  it('updates state with data changes from ClientProfileForm', async () => {
    render(<RequestByClient />);

    await waitFor(() => {
      expect(screen.getByTestId('client-profile-form')).toBeInTheDocument();
    });

    const userIdInput = screen.getByTestId('personal-input-user-id');
    fireEvent.change(userIdInput, {
      target: { value: 'new-user-id-from-input' },
    });

    fireEvent.click(screen.getByTestId('personal-next-button'));
    await waitFor(() =>
      expect(screen.getByTestId('credit-request-form')).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByTestId('credit-next-button'));
    await waitFor(() =>
      expect(screen.getByTestId('review-request-form')).toBeInTheDocument(),
    );

    const reviewPersonalInfo = screen.getByTestId('review-personal-info');
    expect(reviewPersonalInfo).toHaveTextContent('some-user-id');
  });

  it('updates state with data changes from CreditRequestForm', async () => {
    mockLocation.search = '?step=1';
    render(<RequestByClient />);

    await waitFor(() => {
      expect(screen.getByTestId('credit-request-form')).toBeInTheDocument();
    });

    const requestedAmountInput = screen.getByTestId(
      'credit-input-requested-amount',
    );
    fireEvent.change(requestedAmountInput, { target: { value: '99999' } });

    fireEvent.click(screen.getByTestId('credit-next-button'));
    await waitFor(() =>
      expect(screen.getByTestId('review-request-form')).toBeInTheDocument(),
    );

    const reviewAccountInfo = screen.getByTestId('review-account-info');
    expect(reviewAccountInfo).toHaveTextContent('10000');
  });
});
