/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Stepper } from './Steper';

vi.mock('@/lib/utils', () => ({
  cn: (...args: string[]) => args.join(' '),
}));

vi.mock('lucide-react', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    Check: (props: any) => <span {...props} data-testid="icon-check" />,
    ChevronRight: (props: any) => (
      <span {...props} data-testid="icon-chevron-right" />
    ),
  };
});

vi.mock('lucide-react', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    Check: (props: any) => <span {...props} data-testid="icon-check" />,
    ChevronRight: (props: any) => (
      <span {...props} data-testid="icon-chevron-right" />
    ),
  };
});

describe('Stepper', () => {
  const mockSteps = [
    { id: '1', title: 'Step 1: Info', description: 'Personal details' },
    { id: '2', title: 'Step 2: Address' },
    { id: '3', title: 'Step 3: Payment', description: 'Select payment method' },
    { id: '4', title: 'Step 4: Confirm' },
  ];

  it('renders all step titles', () => {
    render(<Stepper steps={mockSteps} currentStep={0} />);

    expect(screen.getByText('Step 1: Info')).toBeInTheDocument();
    expect(screen.getByText('Step 2: Address')).toBeInTheDocument();
    expect(screen.getByText('Step 3: Payment')).toBeInTheDocument();
    expect(screen.getByText('Step 4: Confirm')).toBeInTheDocument();
  });

  it('renders step descriptions when provided', () => {
    render(<Stepper steps={mockSteps} currentStep={0} />);

    expect(screen.getByText('Personal details')).toBeInTheDocument();
    expect(screen.queryByText('Address details')).not.toBeInTheDocument();
    expect(screen.getByText('Select payment method')).toBeInTheDocument();
  });

  it('displays step number for incomplete and active steps', () => {
    render(<Stepper steps={mockSteps} currentStep={1} />);

    expect(screen.getAllByTestId('icon-check')[0]).toBeInTheDocument();

    expect(screen.getByText('2')).toBeInTheDocument();

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('displays checkmark for completed steps', () => {
    render(<Stepper steps={mockSteps} currentStep={2} />);

    const checkIcons = screen.getAllByTestId('icon-check');
    expect(checkIcons).toHaveLength(2);

    const step1Element = screen.getByText('Step 1: Info').closest('li');
    const step2Element = screen.getByText('Step 2: Address').closest('li');

    expect(step1Element).toBeInTheDocument();
    expect(step2Element).toBeInTheDocument();

    expect(
      step1Element?.querySelector('[data-testid="icon-check"]'),
    ).toBeInTheDocument();
    expect(
      step2Element?.querySelector('[data-testid="icon-check"]'),
    ).toBeInTheDocument();
  });

  it('applies active styles to the current step', () => {
    render(<Stepper steps={mockSteps} currentStep={1} />);

    const currentStepText = screen.getByText('Step 2: Address');
    expect(currentStepText).toBeInTheDocument();
    const stepNumberForCurrent = screen.getByText('2');
    expect(stepNumberForCurrent).toBeInTheDocument();
  });

  it('applies completed styles to completed steps', () => {
    render(<Stepper steps={mockSteps} currentStep={2} />);

    const completedStepText = screen.getByText('Step 1: Info');
    expect(completedStepText).toBeInTheDocument();
    const stepIconForCompleted = screen.getAllByTestId('icon-check')[0];
    expect(stepIconForCompleted).toBeInTheDocument();
  });

  it('renders ChevronRight separator between steps, but not for the last step', () => {
    render(<Stepper steps={mockSteps} currentStep={0} />);

    const chevronIcons = screen.getAllByTestId('icon-chevron-right');
    expect(chevronIcons).toHaveLength(mockSteps.length - 1);

    const lastStepElement = screen.getByText('Step 4: Confirm').closest('li');
    expect(lastStepElement).toBeInTheDocument();
    expect(
      lastStepElement?.querySelector('[data-testid="icon-chevron-right"]'),
    ).not.toBeInTheDocument();
  });

  it('handles an empty steps array gracefully', () => {
    render(<Stepper steps={[]} currentStep={0} />);
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('handles currentStep being negative', () => {
    render(<Stepper steps={mockSteps} currentStep={-1} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.queryByTestId('icon-check')).not.toBeInTheDocument();
    expect(screen.queryByText('Step 1: Info')?.className).not.toContain(
      'text-blue-600',
    );
  });

  it('handles currentStep being beyond the number of steps', () => {
    render(<Stepper steps={mockSteps} currentStep={mockSteps.length + 5} />);

    const checkIcons = screen.getAllByTestId('icon-check');
    expect(checkIcons).toHaveLength(mockSteps.length);
  });

  it('applies custom className to the wrapper div', () => {
    const customClass = 'my-custom-stepper-class';
    render(
      <Stepper steps={mockSteps} currentStep={0} className={customClass} />,
    );

    const wrapperDiv = screen.getByRole('list').parentElement;
    expect(wrapperDiv).toHaveClass(customClass);
  });
});
