import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Examples } from './Examples';

describe('Examples', () => {
  it('renders section heading', () => {
    render(<Examples />);
    expect(screen.getByText('Usage Examples')).toBeInTheDocument();
  });

  it('renders cURL upload example', () => {
    render(<Examples />);
    expect(screen.getByText('Upload with cURL')).toBeInTheDocument();
    expect(screen.getByText(/curl --upload-file/)).toBeInTheDocument();
  });

  it('renders shell function section', () => {
    render(<Examples />);
    expect(screen.getByText('Shell Function')).toBeInTheDocument();
    expect(screen.getByText(/\.bashrc/)).toBeInTheDocument();
  });

  it('renders more examples button', () => {
    render(<Examples />);
    expect(screen.getByText('More examples')).toBeInTheDocument();
  });

  it('shows additional examples when button clicked', () => {
    render(<Examples />);
    const button = screen.getByText('More examples');
    fireEvent.click(button);

    expect(screen.getByText('Multiple Files')).toBeInTheDocument();
    expect(screen.getByText('Encrypt with GPG')).toBeInTheDocument();
    expect(screen.getByText('Encrypt with OpenSSL')).toBeInTheDocument();
    expect(screen.getByText('PowerShell (Windows)')).toBeInTheDocument();
  });

  it('toggles button text when expanded', () => {
    render(<Examples />);
    const button = screen.getByText('More examples');
    fireEvent.click(button);
    expect(screen.getByText('Show less')).toBeInTheDocument();
  });

  it('hides additional examples when collapsed', () => {
    render(<Examples />);
    const button = screen.getByText('More examples');
    fireEvent.click(button);
    fireEvent.click(screen.getByText('Show less'));
    expect(screen.queryByText('Multiple Files')).not.toBeInTheDocument();
  });

  it('renders config values in examples', () => {
    render(<Examples />);
    const elements = screen.getAllByText(/https:\/\/transfer\.sh\//);
    expect(elements.length).toBeGreaterThan(0);
  });
});
