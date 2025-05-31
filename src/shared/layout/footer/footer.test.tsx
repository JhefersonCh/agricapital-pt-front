// Footer.test.jsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Footer } from './Footer'; // Assuming your Footer component is in Footer.jsx

describe('Footer', () => {
  it('renders the AgriCapital logo with correct alt text', () => {
    render(<Footer />);
    const logo = screen.getByAltText('Flowbite Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute(
      'src',
      'https://agricapital.com.co/wp-content/uploads/2021/02/Logos-pie-de-pagina-e1738009157979.png',
    );
  });

  it('displays the current year in the copyright notice', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear().toString();
    expect(
      screen.getByText(new RegExp(`© ${currentYear}`)),
    ).toBeInTheDocument();
  });

  it('renders the "AgriCapital" link in the copyright section', () => {
    render(<Footer />);
    const agriCapitalLink = screen.getByRole('link', { name: /AgriCapital/i });
    expect(agriCapitalLink).toBeInTheDocument();
    expect(agriCapitalLink).toHaveAttribute(
      'href',
      'https://agricapital.com.co/',
    );
  });

  it('renders all navigation links', () => {
    render(<Footer />);
    const aboutLink = screen.getByRole('link', { name: /About/i });
    const privacyPolicyLink = screen.getByRole('link', {
      name: /Privacy Policy/i,
    });
    const licensingLink = screen.getByRole('link', { name: /Licensing/i });
    const contactLink = screen.getByRole('link', { name: /Contact/i });

    expect(aboutLink).toBeInTheDocument();
    expect(privacyPolicyLink).toBeInTheDocument();
    expect(licensingLink).toBeInTheDocument();
    expect(contactLink).toBeInTheDocument();
  });

  it('renders the "Prueba técnica." text', () => {
    render(<Footer />);
    expect(screen.getByText(/Prueba técnica./i)).toBeInTheDocument();
  });
});
