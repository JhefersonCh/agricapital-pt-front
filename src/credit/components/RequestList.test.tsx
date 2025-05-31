/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { RequestService } from '../services/requestService';
import { RequestsList } from './RequestsList';

vi.mock('../services/requestService', () => {
  const mockGetPaginatedList = vi.fn();
  return {
    RequestService: vi.fn(() => ({
      getPaginatedList: mockGetPaginatedList,
    })),
  };
});

vi.mock('@/shared/components/Paginator', () => ({
  Paginator: vi.fn(({ page, totalPages, setPage }) => (
    <div data-testid="paginator-mock">
      Paginator Mock: Page {page} of {totalPages}
      <button onClick={() => setPage(page + 1)}>Next Page</button>
      <button onClick={() => setPage(1)}>Go to Page 1</button>
    </div>
  )),
}));

vi.mock('../components/ReviewCredit', () => ({
  ReviewCredit: vi.fn(({ label, requestId, clientId }) => (
    <button data-testid={`review-credit-mock-${requestId}`}>
      {label} {requestId} ({clientId})
    </button>
  )),
}));

describe('RequestsList', () => {
  const mockRequestsPage1 = [
    {
      id: 'req1',
      client_id: 'clientA',
      requested_amount: 1000,
      risk_score: 5,
      status: 'pending',
    },
    {
      id: 'req2',
      client_id: 'clientB',
      requested_amount: 2500,
      risk_score: 15,
      status: 'approved',
    },
    {
      id: 'req3',
      client_id: 'clientC',
      requested_amount: 500,
      risk_score: 40,
      status: 'rejected',
    },
  ];

  const mockRequestsPage2 = [
    {
      id: 'req4',
      client_id: 'clientD',
      requested_amount: 1500,
      risk_score: 60,
      status: 'pending',
    },
    {
      id: 'req5',
      client_id: 'clientE',
      requested_amount: 3000,
      risk_score: 80,
      status: 'approved',
    },
  ];

  const totalItems = 13;
  const limit = 10;

  let mockRequestService: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRequestService = new RequestService();

    mockRequestService.getPaginatedList.mockImplementation(
      (page: number, limit: number, sort_order: string, order_by: string) => {
        if (page === 1) {
          return Promise.resolve({
            data: mockRequestsPage1,
            pagination: { total_items: totalItems, page, limit },
          });
        } else if (page === 2) {
          return Promise.resolve({
            data: mockRequestsPage2,
            pagination: { total_items: totalItems, page, limit },
          });
        }
        return Promise.resolve({
          data: [],
          pagination: { total_items: 0, page, limit },
        });
      },
    );
  });

  it('should display loading message initially and then render requests', async () => {
    render(<RequestsList />);

    expect(screen.getByText('Cargando solicitudes...')).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.queryByText('Cargando solicitudes...'),
      ).not.toBeInTheDocument();
      expect(screen.getByText('req1')).toBeInTheDocument();
      expect(screen.getByText('clientA')).toBeInTheDocument();
      expect(screen.getByText('1000')).toBeInTheDocument();
      expect(screen.getByText('5 (Muy bajo)')).toBeInTheDocument();
    });

    expect(screen.getByText('req2')).toBeInTheDocument();
    expect(screen.getByText('req3')).toBeInTheDocument();

    expect(mockRequestService.getPaginatedList).toHaveBeenCalledTimes(1);
    expect(mockRequestService.getPaginatedList).toHaveBeenCalledWith(
      1,
      limit,
      'asc',
      'id',
    );
  });

  it('should correctly display risk scores as text', async () => {
    render(<RequestsList />);

    await waitFor(() => {
      expect(screen.getByText('5 (Muy bajo)')).toBeInTheDocument();
      expect(screen.getByText('15 (Bajo)')).toBeInTheDocument();
      expect(screen.getByText('40 (Medio)')).toBeInTheDocument();
    });
  });

  it('should handle pagination correctly', async () => {
    render(<RequestsList />);

    await waitFor(() => {
      expect(screen.getByText('req1')).toBeInTheDocument();
    });
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /next page/i }));

    await waitFor(() => {
      expect(mockRequestService.getPaginatedList).toHaveBeenCalledTimes(2);
      expect(mockRequestService.getPaginatedList).toHaveBeenNthCalledWith(
        2,
        2,
        limit,
        'asc',
        'id',
      );
    });

    await waitFor(() => {
      expect(screen.queryByText('req1')).not.toBeInTheDocument();
      expect(screen.getByText('req4')).toBeInTheDocument();
      expect(screen.getByText('req5')).toBeInTheDocument();
    });
  });

  it('should handle sorting by "ID" correctly', async () => {
    render(<RequestsList />);

    await waitFor(() => {
      expect(screen.getByText('req1')).toBeInTheDocument();
    });

    const user = userEvent.setup();
    await user.click(screen.getByRole('columnheader', { name: 'ID' }));

    await waitFor(() => {
      expect(mockRequestService.getPaginatedList).toHaveBeenCalledTimes(2);
      expect(mockRequestService.getPaginatedList).toHaveBeenNthCalledWith(
        2,
        1,
        limit,
        'desc',
        'id',
      );
    });

    await user.click(screen.getByRole('columnheader', { name: 'ID' }));
    await waitFor(() => {
      expect(mockRequestService.getPaginatedList).toHaveBeenCalledTimes(3);
      expect(mockRequestService.getPaginatedList).toHaveBeenNthCalledWith(
        3,
        1,
        limit,
        'asc',
        'id',
      );
    });
  });

  it('should handle sorting by "ID Cliente" correctly', async () => {
    render(<RequestsList />);
    await waitFor(() => {});

    const user = userEvent.setup();
    await user.click(screen.getByRole('columnheader', { name: 'ID Cliente' }));
    await waitFor(() => {
      expect(mockRequestService.getPaginatedList).toHaveBeenNthCalledWith(
        2,
        1,
        limit,
        'desc',
        'client_id',
      );
    });
  });

  it('should handle sorting by "Monto Solicitado" correctly', async () => {
    render(<RequestsList />);
    await waitFor(() => {});

    const user = userEvent.setup();
    await user.click(
      screen.getByRole('columnheader', { name: 'Monto Solicitado' }),
    );
    await waitFor(() => {
      expect(mockRequestService.getPaginatedList).toHaveBeenNthCalledWith(
        2,
        1,
        limit,
        'desc',
        'requested_amount',
      );
    });
  });

  it('should handle sorting by "Nivel de Riesgo" correctly', async () => {
    render(<RequestsList />);
    await waitFor(() => {});

    const user = userEvent.setup();
    await user.click(
      screen.getByRole('columnheader', { name: 'Nivel de Riesgo' }),
    );
    await waitFor(() => {
      expect(mockRequestService.getPaginatedList).toHaveBeenNthCalledWith(
        2,
        1,
        limit,
        'desc',
        'risk_score',
      );
    });
  });

  it('should call console.error on API error', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    mockRequestService.getPaginatedList.mockImplementationOnce(() =>
      Promise.reject(new Error('Network error')),
    );

    render(<RequestsList />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error al cargar solicitudes:',
        expect.any(Error),
      );
    });

    await waitFor(() => {
      expect(
        screen.queryByText('Cargando solicitudes...'),
      ).not.toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });

  it('should render ReviewCredit component for each request', async () => {
    render(<RequestsList />);

    await waitFor(() => {
      expect(screen.getByTestId('review-credit-mock-req1')).toBeInTheDocument();
      expect(screen.getByTestId('review-credit-mock-req2')).toBeInTheDocument();
      expect(screen.getByTestId('review-credit-mock-req3')).toBeInTheDocument();
    });
  });
});
