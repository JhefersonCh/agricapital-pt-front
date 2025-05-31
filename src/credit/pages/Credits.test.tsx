/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Credits } from './Credits';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className }) => (
    <button data-testid="credit-button" onClick={onClick} className={className}>
      {children}
    </button>
  ),
}));

vi.mock('../components/RequestsList', () => ({
  RequestsList: () => <div>RequestsList Mock</div>,
}));

describe('Credits', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the "Iniciar Crédito" button with correct text and classes', () => {
    render(<Credits />);

    const initiateCreditButton = screen.getByTestId('credit-button');

    expect(initiateCreditButton).toBeInTheDocument();
    expect(initiateCreditButton).toHaveTextContent('Iniciar Crédito');

    expect(initiateCreditButton).toHaveClass(
      'bg-[#499403]',
      'hover:bg-[#8bd149]',
      'text-white',
      'hover:text-white',
    );
  });

  it('calls navigate to "/credit/clients" when "Iniciar Crédito" button is clicked', () => {
    render(<Credits />);

    const initiateCreditButton = screen.getByTestId('credit-button');

    fireEvent.click(initiateCreditButton);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/credit/clients');
  });

  it('renders the RequestsList component', () => {
    render(<Credits />);

    expect(screen.getByText('RequestsList Mock')).toBeInTheDocument();
  });

  it('renders the main div structure with correct flex utility', () => {
    const { container } = render(<Credits />);

    const mainDiv = container.querySelector('div');
    expect(mainDiv).toBeInTheDocument();
    const flexDiv = container.querySelector('.flex.justify-end');
    expect(flexDiv).toBeInTheDocument();
  });
});
