import { categoriesApi } from '../api/categories';
import { useApiQuery } from './useApiQuery';

export function useCategories() {
  // Existing categories stay listed while a refreshed list loads
  const { data, error, loading, reload } = useApiQuery('categories', (signal) => categoriesApi.list(signal));
  return { categories: data ?? [], error, loading, reload };
}
