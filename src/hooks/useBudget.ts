import { budgetsApi } from '../api/budgets';
import { useApiQuery } from './useApiQuery';

export function useBudget(month: string) {
  const { data, error, pending, setData } = useApiQuery(`budget:${month}`, (signal) =>
    budgetsApi.get(month, signal),
  );
  // A save already returns the fresh summary, so it replaces the data without a refetch
  return { summary: data, error, loading: pending, replace: setData };
}
