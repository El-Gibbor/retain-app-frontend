import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../api/client';
import { expensesApi } from '../api/expenses';
import type { Expense } from '../types/expense';
import { getErrorMessage } from '../utils/errors';

interface ExpenseState {
  id: string | null;
  expense: Expense | null;
  error: string | null;
  notFound: boolean;
}

export function useExpense(id: string) {
  const [state, setState] = useState<ExpenseState>({ id: null, expense: null, error: null, notFound: false });

  useEffect(() => {
    const controller = new AbortController();
    expensesApi
      .get(id, controller.signal)
      .then((expense) => setState({ id, expense, error: null, notFound: false }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        const notFound = error instanceof ApiError && error.status === 404;
        setState({ id, expense: null, error: notFound ? null : getErrorMessage(error), notFound });
      });
    return () => controller.abort();
  }, [id]);

  // Lets the page show an edit immediately without refetching
  const replace = useCallback((expense: Expense) => setState((current) => ({ ...current, expense })), []);

  return {
    expense: state.id === id ? state.expense : null,
    error: state.id === id ? state.error : null,
    notFound: state.id === id && state.notFound,
    loading: state.id !== id,
    replace,
  };
}
