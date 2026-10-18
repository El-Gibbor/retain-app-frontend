import { useEffect, useState } from 'react';
import { dashboardApi } from '../api/dashboard';
import type { DashboardSummary } from '../types/dashboard';
import { getErrorMessage } from '../utils/errors';

interface DashboardState {
  key: string | null;
  summary: DashboardSummary | null;
  error: string | null;
}

/** reloadKey forces a refetch for the same month, e.g. after adding an expense */
export function useDashboard(month: string, reloadKey = 0) {
  const [state, setState] = useState<DashboardState>({ key: null, summary: null, error: null });
  const requestKey = `${month}#${reloadKey}`;

  useEffect(() => {
    const controller = new AbortController();
    dashboardApi
      .get(month, controller.signal)
      .then((summary) => setState({ key: requestKey, summary, error: null }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({ key: requestKey, summary: null, error: getErrorMessage(error) });
      });
    return () => controller.abort();
  }, [month, requestKey]);

  const current = state.key === requestKey;
  // During a same-month refresh the previous figures stay on screen instead of skeletons
  const sameMonth = state.key?.startsWith(`${month}#`) ?? false;
  return {
    summary: sameMonth ? state.summary : null,
    error: current ? state.error : null,
    loading: !sameMonth,
  };
}
