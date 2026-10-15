import { useCallback, useEffect, useState } from 'react';
import { budgetsApi } from '../api/budgets';
import type { BudgetSummary } from '../types/budget';
import { getErrorMessage } from '../utils/errors';

interface BudgetState {
  month: string | null;
  summary: BudgetSummary | null;
  error: string | null;
}

export function useBudget(month: string) {
  const [state, setState] = useState<BudgetState>({ month: null, summary: null, error: null });

  useEffect(() => {
    const controller = new AbortController();
    budgetsApi
      .get(month, controller.signal)
      .then((summary) => setState({ month, summary, error: null }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({ month, summary: null, error: getErrorMessage(error) });
      });
    return () => controller.abort();
  }, [month]);

  // A save already returns the fresh summary, so no refetch is needed
  const replace = useCallback(
    (summary: BudgetSummary) => setState({ month: summary.month, summary, error: null }),
    [],
  );

  const current = state.month === month;
  return {
    summary: current ? state.summary : null,
    error: current ? state.error : null,
    loading: !current,
    replace,
  };
}
