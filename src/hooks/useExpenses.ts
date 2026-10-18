import { expensesApi } from '../api/expenses';
import type { ExpenseQuery } from '../types/expense';
import { useApiQuery } from './useApiQuery';

export function useExpenses(query: ExpenseQuery) {
  // Previous rows stay visible while the next page or filter loads
  const { data, error, pending, reload } = useApiQuery(
    `expenses:${JSON.stringify(query)}`,
    (signal) => expensesApi.list(query, signal),
    { keepPreviousData: true },
  );
  return { result: data, error, loading: pending, reload };
}
