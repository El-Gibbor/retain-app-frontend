import { useEffect, useState } from 'react';
import { adminApi } from '../api/admin';
import type { AdminInsights } from '../types/admin';
import { getErrorMessage } from '../utils/errors';

interface InsightsState {
  key: number | null;
  insights: AdminInsights | null;
  error: string | null;
}

/** Bump reloadKey to refetch after a category change */
export function useAdminInsights(reloadKey: number) {
  const [state, setState] = useState<InsightsState>({ key: null, insights: null, error: null });

  useEffect(() => {
    const controller = new AbortController();
    adminApi
      .insights(controller.signal)
      .then((insights) => setState({ key: reloadKey, insights, error: null }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState((current) => ({ ...current, key: reloadKey, error: getErrorMessage(error) }));
      });
    return () => controller.abort();
  }, [reloadKey]);

  return {
    insights: state.insights,
    error: state.key === reloadKey ? state.error : null,
    // Only the very first load shows skeletons; refreshes keep the old figures visible
    loading: state.insights === null && state.error === null,
  };
}
