import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { DownloadPage } from './Download';
import type { DownloadConfig } from '../types/config';

describe('DownloadPage', () => {
  const originalConfig = window.__CONFIG__;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    window.__CONFIG__ = {
      webAddress: 'https://transfer.sh/',
      hostname: 'transfer.sh',
      filename: 'test-file.txt',
      contentType: 'text/plain',
      contentLength: '1024',
      downloadUrl: 'https://transfer.sh/abc123/test-file.txt',
    } as DownloadConfig;
  });

  afterEach(() => {
    window.__CONFIG__ = originalConfig;
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders filename in heading', () => {
    render(<DownloadPage />);
    expect(screen.getByRole('heading', { name: 'test-file.txt' })).toBeInTheDocument();
  });

  it('renders content type', () => {
    render(<DownloadPage />);
    const contentTypes = screen.getAllByText('text/plain');
    expect(contentTypes.length).toBeGreaterThan(0);
  });

  it('renders formatted file size', () => {
    render(<DownloadPage />);
    expect(screen.getByText('1 KB')).toBeInTheDocument();
  });

  it('renders download button', () => {
    render(<DownloadPage />);
    const downloadLink = screen.getByRole('link', { name: /Download/i });
    expect(downloadLink).toHaveAttribute('href', 'https://transfer.sh/abc123/test-file.txt');
    expect(downloadLink).toHaveAttribute('download', 'test-file.txt');
  });

  it('renders copy link button', () => {
    render(<DownloadPage />);
    expect(screen.getByText('Copy Link')).toBeInTheDocument();
  });

  it('copies link to clipboard when copy button clicked', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<DownloadPage />);

    await act(async () => {
      fireEvent.click(screen.getByText('Copy Link'));
    });

    expect(writeText).toHaveBeenCalledWith('https://transfer.sh/abc123/test-file.txt');
    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
  });

  it('renders delete button', () => {
    render(<DownloadPage />);
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('opens delete modal when delete clicked', () => {
    render(<DownloadPage />);
    fireEvent.click(screen.getByText('Delete'));
    expect(screen.getByText('Delete File')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Deletion token')).toBeInTheDocument();
  });

  it('closes delete modal when cancel clicked', () => {
    render(<DownloadPage />);
    fireEvent.click(screen.getByText('Delete'));
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Delete File')).not.toBeInTheDocument();
  });

  it('renders header with upload link', () => {
    render(<DownloadPage />);
    expect(screen.getByText('Upload Files')).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(<DownloadPage />);
    expect(screen.getByLabelText('GitHub')).toBeInTheDocument();
  });

  it('renders image preview for image type', () => {
    window.__CONFIG__ = {
      ...window.__CONFIG__,
      previewType: 'image',
    } as DownloadConfig;

    render(<DownloadPage />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('renders video preview for video type', () => {
    window.__CONFIG__ = {
      ...window.__CONFIG__,
      previewType: 'video',
      contentType: 'video/mp4',
    } as DownloadConfig;

    const { container } = render(<DownloadPage />);
    expect(container.querySelector('video')).toBeInTheDocument();
  });

  it('renders audio preview for audio type', () => {
    window.__CONFIG__ = {
      ...window.__CONFIG__,
      previewType: 'audio',
    } as DownloadConfig;

    const { container } = render(<DownloadPage />);
    expect(container.querySelector('audio')).toBeInTheDocument();
  });

  it('renders generic preview for unknown type', () => {
    render(<DownloadPage />);
    expect(screen.getByText('Preview not available for this file type')).toBeInTheDocument();
  });

  it('formats 0 bytes correctly', () => {
    window.__CONFIG__ = {
      ...window.__CONFIG__,
      contentLength: '0',
    } as DownloadConfig;

    render(<DownloadPage />);
    expect(screen.getByText('0 Bytes')).toBeInTheDocument();
  });

  it('formats large file sizes correctly', () => {
    window.__CONFIG__ = {
      ...window.__CONFIG__,
      contentLength: '1073741824',
    } as DownloadConfig;

    render(<DownloadPage />);
    expect(screen.getByText('1 GB')).toBeInTheDocument();
  });

  it('renders code preview for code type', () => {
    vi.spyOn(global, 'fetch').mockImplementation(() => new Promise(() => {}));

    window.__CONFIG__ = {
      ...window.__CONFIG__,
      previewType: 'code',
      filename: 'test.js',
    } as DownloadConfig;

    render(<DownloadPage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders markdown preview for markdown type', () => {
    vi.spyOn(global, 'fetch').mockImplementation(() => new Promise(() => {}));

    window.__CONFIG__ = {
      ...window.__CONFIG__,
      previewType: 'markdown',
      filename: 'README.md',
    } as DownloadConfig;

    render(<DownloadPage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('deletes file successfully', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
    } as Response);

    render(<DownloadPage />);

    // Open delete modal
    fireEvent.click(screen.getByText('Delete'));

    // Enter deletion token
    const input = screen.getByPlaceholderText('Deletion token');
    fireEvent.change(input, { target: { value: 'my-delete-token' } });

    // Click delete button in modal (the red one with bg-red-600)
    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    const modalDeleteButton = deleteButtons.find((btn) => btn.classList.contains('bg-red-600'))!;

    await act(async () => {
      fireEvent.click(modalDeleteButton);
    });

    await waitFor(() => {
      expect(screen.getByText('File deleted successfully')).toBeInTheDocument();
    });
  });

  it('shows error when delete fails', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
    } as Response);

    render(<DownloadPage />);

    fireEvent.click(screen.getByText('Delete'));

    const input = screen.getByPlaceholderText('Deletion token');
    fireEvent.change(input, { target: { value: 'wrong-token' } });

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    const modalDeleteButton = deleteButtons.find((btn) => btn.classList.contains('bg-red-600'))!;

    await act(async () => {
      fireEvent.click(modalDeleteButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/Failed to delete file/)).toBeInTheDocument();
    });
  });

  it('shows error on network failure during delete', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));

    render(<DownloadPage />);

    fireEvent.click(screen.getByText('Delete'));

    const input = screen.getByPlaceholderText('Deletion token');
    fireEvent.change(input, { target: { value: 'some-token' } });

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    const modalDeleteButton = deleteButtons.find((btn) => btn.classList.contains('bg-red-600'))!;

    await act(async () => {
      fireEvent.click(modalDeleteButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/Failed to delete file/)).toBeInTheDocument();
    });
  });

  it('does not delete without token', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');

    render(<DownloadPage />);

    fireEvent.click(screen.getByText('Delete'));

    // Don't enter a token, just click delete
    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    const modalDeleteButton = deleteButtons.find((btn) => btn.classList.contains('bg-red-600'))!;
    fireEvent.click(modalDeleteButton);

    // Fetch should not be called
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('shows loading state during delete', async () => {
    vi.spyOn(global, 'fetch').mockImplementation(() => new Promise(() => {}));

    render(<DownloadPage />);

    fireEvent.click(screen.getByText('Delete'));

    const input = screen.getByPlaceholderText('Deletion token');
    fireEvent.change(input, { target: { value: 'token' } });

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    const modalDeleteButton = deleteButtons.find((btn) => btn.classList.contains('bg-red-600'))!;

    await act(async () => {
      fireEvent.click(modalDeleteButton);
    });

    expect(screen.getByText('Deleting...')).toBeInTheDocument();
  });

  it('reverts copied state after timeout', async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<DownloadPage />);

    await act(async () => {
      fireEvent.click(screen.getByText('Copy Link'));
    });

    expect(screen.getByText('Copied!')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText('Copy Link')).toBeInTheDocument();
  });
});
