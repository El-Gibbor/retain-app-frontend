import { expensesApi } from '../api/expenses';
import { useApiQuery } from './useApiQuery';

export function useExpense(id: string) {
  const { data, error, errorStatus, pending, setData } = useApiQuery(`expense:${id}`, (signal) =>
    expensesApi.get(id, signal),
  );
  const notFound = errorStatus === 404;
  return {
    expense: data,
    error: notFound ? null : error,
    notFound,
    loading: pending,
    // Lets the page show an edit immediately without refetching
    replace: setData,
  };
}
