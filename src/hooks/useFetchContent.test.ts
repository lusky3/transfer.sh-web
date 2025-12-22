import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useFetchContent } from './useFetchContent';

describe('useFetchContent', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns loading state initially', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => {}))
    );

    const { result } = renderHook(() => useFetchContent('https://example.com/file.txt'));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('returns data on successful fetch', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          text: () => Promise.resolve('file content'),
        })
      )
    );

    const { result } = renderHook(() => useFetchContent('https://example.com/file.txt'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe('file content');
    expect(result.current.error).toBe(null);
  });

  it('returns error on failed fetch', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: false,
        })
      )
    );

    const { result } = renderHook(() => useFetchContent('https://example.com/file.txt'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe('Failed to load file');
  });

  it('returns error on network failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new Error('Network error')))
    );

    const { result } = renderHook(() => useFetchContent('https://example.com/file.txt'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe('Network error');
  });

  it('refetches when URL changes', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, text: () => Promise.resolve('content 1') })
      .mockResolvedValueOnce({ ok: true, text: () => Promise.resolve('content 2') });

    vi.stubGlobal('fetch', fetchMock);

    const { result, rerender } = renderHook(({ url }) => useFetchContent(url), {
      initialProps: { url: 'https://example.com/file1.txt' },
    });

    await waitFor(() => {
      expect(result.current.data).toBe('content 1');
    });

    rerender({ url: 'https://example.com/file2.txt' });

    await waitFor(() => {
      expect(result.current.data).toBe('content 2');
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
