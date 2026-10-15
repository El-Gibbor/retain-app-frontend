import { useEffect, useState } from 'react';
import { categoriesApi } from '../api/categories';
import type { Category } from '../types/category';
import { getErrorMessage } from '../utils/errors';

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

export function useCategories(): CategoriesState {
  const [state, setState] = useState<CategoriesState>({ categories: [], loading: true, error: null });

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
  }, []);

  return state;
}
