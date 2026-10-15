import { useCallback, useEffect, useState } from 'react';
import { expensesApi } from '../api/expenses';
import type { Expense, ExpenseQuery, Paginated } from '../types/expense';
import { getErrorMessage } from '../utils/errors';

interface ExpensesState {
  /** Which request the result or error belongs to */
  key: string | null;
  result: Paginated<Expense> | null;
  error: string | null;
}

export function useExpenses(query: ExpenseQuery) {
  const [reloadKey, setReloadKey] = useState(0);
  const [state, setState] = useState<ExpensesState>({ key: null, result: null, error: null });
  const requestKey = `${JSON.stringify(query)}#${reloadKey}`;

  useEffect(() => {
    const controller = new AbortController();

    expensesApi
      .list(query, controller.signal)
      .then((result) => setState({ key: requestKey, result, error: null }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        // Previous results stay on screen next to the error
        setState((current) => ({ ...current, key: requestKey, error: getErrorMessage(error) }));
      });

    return () => controller.abort();
  }, [query, requestKey]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  return {
    result: state.result,
    error: state.key === requestKey ? state.error : null,
    loading: state.key !== requestKey,
    reload,
  };
}
