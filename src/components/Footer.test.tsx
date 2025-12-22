import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders copyright with hostname', () => {
    render(<Footer />);
    expect(screen.getByText(/transfer\.sh/)).toBeInTheDocument();
  });

  it('renders current year', () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });

  it('renders GitHub link', () => {
    render(<Footer />);
    const githubLink = screen.getByLabelText('GitHub');
    expect(githubLink).toHaveAttribute('href', 'https://github.com/dutchcoders/transfer.sh');
    expect(githubLink).toHaveAttribute('target', '_blank');
  });

  it('renders email contact link when configured', () => {
    render(<Footer />);
    const emailLink = screen.getByLabelText('Contact');
    expect(emailLink).toHaveAttribute('href', 'mailto:test@example.com');
  });

  it('renders tagline', () => {
    render(<Footer />);
    expect(screen.getByText(/Easy file sharing from the command line/)).toBeInTheDocument();
  });
});
