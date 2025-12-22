import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MarkdownPreview } from './MarkdownPreview';

describe('MarkdownPreview', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('shows loading state initially', () => {
    vi.spyOn(global, 'fetch').mockImplementation(() => new Promise(() => {}));
    render(<MarkdownPreview url="https://example.com/readme.md" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders markdown content after loading', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('# Hello World'),
    } as Response);

    render(<MarkdownPreview url="https://example.com/readme.md" />);

    await waitFor(() => {
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });
  });

  it('shows error when fetch fails', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
    } as Response);

    render(<MarkdownPreview url="https://example.com/readme.md" />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load file')).toBeInTheDocument();
    });
  });

  it('shows error on network failure', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));

    render(<MarkdownPreview url="https://example.com/readme.md" />);

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('parses bold text', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('**bold text**'),
    } as Response);

    const { container } = render(<MarkdownPreview url="https://example.com/readme.md" />);

    await waitFor(() => {
      expect(container.querySelector('strong')).toHaveTextContent('bold text');
    });
  });

  it('parses italic text', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('*italic text*'),
    } as Response);

    const { container } = render(<MarkdownPreview url="https://example.com/readme.md" />);

    await waitFor(() => {
      expect(container.querySelector('em')).toHaveTextContent('italic text');
    });
  });

  it('parses inline code', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('Use `npm install`'),
    } as Response);

    const { container } = render(<MarkdownPreview url="https://example.com/readme.md" />);

    await waitFor(() => {
      expect(container.querySelector('code')).toHaveTextContent('npm install');
    });
  });

  it('parses links', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('[GitHub](https://github.com)'),
    } as Response);

    render(<MarkdownPreview url="https://example.com/readme.md" />);

    await waitFor(() => {
      const link = screen.getByText('GitHub');
      expect(link).toHaveAttribute('href', 'https://github.com');
    });
  });
});
