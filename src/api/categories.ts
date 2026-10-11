import type { Category } from '../types/category';
import { request } from './client';

export const categoriesApi = {
  list: (signal?: AbortSignal) => request<Category[]>('/categories', { signal }),
};
