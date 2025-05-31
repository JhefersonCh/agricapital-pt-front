import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Clients } from './Clients';

vi.mock('../components/UserList', () => ({
  UserList: () => <div>UserList Mock</div>,
}));

vi.mock('../components/CreateOrEditClient', () => ({
  CreateClient: ({ label, className }) => (
    <button data-testid="create-client-button" className={className}>
      {label}
    </button>
  ),
}));

describe('Clients', () => {
  it('renders the CreateClient component with correct label and classes', () => {
    render(<Clients />);

    const createClientButton = screen.getByTestId('create-client-button');

    expect(createClientButton).toBeInTheDocument();
    expect(createClientButton).toHaveTextContent('Crear Cliente');
    expect(createClientButton).toHaveClass(
      'bg-[#499403]',
      'hover:bg-[#8bd149]',
      'text-white',
      'hover:text-white',
    );
  });

  it('renders the UserList component', () => {
    render(<Clients />);

    expect(screen.getByText('UserList Mock')).toBeInTheDocument();
  });

  it('renders the main div structure', () => {
    const { container } = render(<Clients />);
    const mainDiv = container.querySelector('div');
    expect(mainDiv).toBeInTheDocument();
  });
});
