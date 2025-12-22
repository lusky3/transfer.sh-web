import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PreviewContainer, PreviewLoading, PreviewError } from './PreviewContainer';

describe('PreviewContainer', () => {
  it('renders children', () => {
    render(<PreviewContainer>Test content</PreviewContainer>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies default variant styles', () => {
    const { container } = render(<PreviewContainer>Content</PreviewContainer>);
    expect(container.firstChild).toHaveClass('bg-gray-100', 'dark:bg-gray-900', 'rounded-lg');
  });

  it('applies dark variant styles', () => {
    const { container } = render(<PreviewContainer variant="dark">Content</PreviewContainer>);
    expect(container.firstChild).toHaveClass('bg-gray-900', 'rounded-lg');
  });

  it('applies bordered variant styles', () => {
    const { container } = render(<PreviewContainer variant="bordered">Content</PreviewContainer>);
    expect(container.firstChild).toHaveClass(
      'bg-white',
      'dark:bg-gray-900',
      'rounded-lg',
      'border'
    );
  });

  it('applies custom className', () => {
    const { container } = render(
      <PreviewContainer className="custom-class">Content</PreviewContainer>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('PreviewLoading', () => {
  it('renders loading text', () => {
    render(<PreviewLoading />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('uses default text color', () => {
    render(<PreviewLoading />);
    expect(screen.getByText('Loading...')).toHaveClass('text-gray-500');
  });

  it('uses dark variant text color', () => {
    render(<PreviewLoading variant="dark" />);
    expect(screen.getByText('Loading...')).toHaveClass('text-gray-400');
  });
});

describe('PreviewError', () => {
  it('renders error message', () => {
    render(<PreviewError message="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('uses default text color', () => {
    render(<PreviewError message="Error" />);
    expect(screen.getByText('Error')).toHaveClass('text-red-500');
  });

  it('uses dark variant text color', () => {
    render(<PreviewError message="Error" variant="dark" />);
    expect(screen.getByText('Error')).toHaveClass('text-red-400');
  });
});
