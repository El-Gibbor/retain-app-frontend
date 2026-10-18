import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '../api/client';
import { getErrorMessage } from '../utils/errors';

interface QueryState<T> {
  /** Request the stored result belongs to: `${key}#${reloadCount}` */
  requestKey: string | null;
  /** Key without the reload count, so a refresh of the same data can keep showing it */
  key: string | null;
  data: T | null;
  error: string | null;
  errorStatus: number | null;
}

interface QueryOptions {
  /** Keep showing the last data while a different key loads, e.g. the next page of a list */
  keepPreviousData?: boolean;
}

export interface QueryResult<T> {
  data: T | null;
  error: string | null;
  errorStatus: number | null;
  /** A request for the current key has not settled yet */
  pending: boolean;
  /** Pending with nothing to show yet; drives skeletons */
  loading: boolean;
  reload: () => void;
  /** Replaces the data for the current key, e.g. with a save response */
  setData: (data: T) => void;
}

/**
 * Fetches data for `key`, cancelling stale requests whenever the key changes.
 * The fetcher may change identity each render; only a new key triggers a request.
 */
export function useApiQuery<T>(
  key: string,
  fetcher: (signal: AbortSignal) => Promise<T>,
  { keepPreviousData = false }: QueryOptions = {},
): QueryResult<T> {
  const [reloadCount, setReloadCount] = useState(0);
  const [state, setState] = useState<QueryState<T>>({
    requestKey: null,
    key: null,
    data: null,
    error: null,
    errorStatus: null,
  });
  const requestKey = `${key}#${reloadCount}`;

  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    const controller = new AbortController();
    fetcherRef
      .current(controller.signal)
      .then((data) => setState({ requestKey, key, data, error: null, errorStatus: null }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState((current) => ({
          requestKey,
          key,
          data: current.key === key || keepPreviousData ? current.data : null,
          error: getErrorMessage(error),
          errorStatus: error instanceof ApiError ? error.status : null,
        }));
      });
    return () => controller.abort();
  }, [key, requestKey, keepPreviousData]);

  const reload = useCallback(() => setReloadCount((count) => count + 1), []);
  const setData = useCallback((data: T) => setState((current) => ({ ...current, data })), []);

  const settled = state.requestKey === requestKey;
  const data = state.key === key || keepPreviousData ? state.data : null;

  return {
    data,
    error: settled ? state.error : null,
    errorStatus: settled ? state.errorStatus : null,
    pending: !settled,
    loading: !settled && data === null,
    reload,
    setData,
  };
}
