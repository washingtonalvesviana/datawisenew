import { useState, useEffect } from 'react';
import { api, APIError } from '../services/api';

interface UseApiState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

export function useApi<T>(
  fetchFn: () => Promise<T>,
  deps: any[] = []
): UseApiState<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState(s => ({ ...s, loading: true }));
        const data = await fetchFn();
        setState({ data, error: null, loading: false });
      } catch (error) {
        setState({ data: null, error: error as Error, loading: false });
      }
    };

    fetchData();
  }, deps);

  return state;
}