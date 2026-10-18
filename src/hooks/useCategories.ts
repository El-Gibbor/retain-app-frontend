import { useCallback, useEffect, useState } from 'react';
import { categoriesApi } from '../api/categories';
import type { Category } from '../types/category';
import { getErrorMessage } from '../utils/errors';

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

export function useCategories(): CategoriesState & { reload: () => void } {
  const [state, setState] = useState<CategoriesState>({ categories: [], loading: true, error: null });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    categoriesApi
      .list(controller.signal)
      .then((categories) => setState({ categories, loading: false, error: null }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({ categories: [], loading: false, error: getErrorMessage(error) });
      });
    return () => controller.abort();
  }, [reloadKey]);

  // Existing categories stay listed while the refreshed list loads
  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  return { ...state, reload };
}
