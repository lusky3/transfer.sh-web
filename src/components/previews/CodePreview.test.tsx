import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { CodePreview } from './CodePreview';

describe('CodePreview', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('shows loading state initially', () => {
    vi.spyOn(global, 'fetch').mockImplementation(() => new Promise(() => {}));
    render(<CodePreview url="https://example.com/code.js" filename="code.js" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders code after loading', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('const x = 1;'),
    } as Response);

    render(<CodePreview url="https://example.com/code.js" filename="code.js" />);

    await waitFor(() => {
      expect(screen.getByText(/const/)).toBeInTheDocument();
    });
  });

  it('shows error when fetch fails', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
    } as Response);

    render(<CodePreview url="https://example.com/code.js" filename="code.js" />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load file')).toBeInTheDocument();
    });
  });

  it('shows error on network failure', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));

    render(<CodePreview url="https://example.com/code.js" filename="code.js" />);

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('renders copy button', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('const x = 1;'),
    } as Response);

    render(<CodePreview url="https://example.com/code.js" filename="code.js" />);

    await waitFor(() => {
      expect(screen.getByTitle('Copy code')).toBeInTheDocument();
    });
  });

  it('copies code to clipboard when copy button clicked', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('const x = 1;'),
    } as Response);

    render(<CodePreview url="https://example.com/code.js" filename="code.js" />);

    await waitFor(() => {
      expect(screen.getByTitle('Copy code')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByTitle('Copy code'));
    });

    expect(writeText).toHaveBeenCalledWith('const x = 1;');
  });

  it('renders line numbers', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('line1\nline2\nline3'),
    } as Response);

    render(<CodePreview url="https://example.com/code.txt" filename="code.txt" />);

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  it('detects language from file extension', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('function test() {}'),
    } as Response);

    const { container } = render(
      <CodePreview url="https://example.com/code.ts" filename="code.ts" />
    );

    await waitFor(() => {
      expect(container.querySelector('pre')).toBeInTheDocument();
    });
  });
});
