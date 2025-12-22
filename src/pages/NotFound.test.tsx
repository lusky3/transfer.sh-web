import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NotFoundPage } from './NotFound';

describe('NotFoundPage', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('renders 404 heading', () => {
    render(<NotFoundPage />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders file not found message', () => {
    render(<NotFoundPage />);
    expect(screen.getByText('File not found')).toBeInTheDocument();
  });

  it('renders upload link', () => {
    render(<NotFoundPage />);
    const link = screen.getByRole('link', { name: /Upload a file/i });
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders header with upload link', () => {
    render(<NotFoundPage />);
    expect(screen.getByText('Upload Files')).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(<NotFoundPage />);
    expect(screen.getByLabelText('GitHub')).toBeInTheDocument();
  });
});
