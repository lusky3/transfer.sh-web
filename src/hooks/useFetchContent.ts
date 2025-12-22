import { useState, useEffect } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetchContent(url: string): FetchState<string> {
  const [state, setState] = useState<FetchState<string>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    setState({ data: null, loading: true, error: null });

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load file');
        return res.text();
      })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => setState({ data: null, loading: false, error: err.message }));
  }, [url]);

  return state;
}
