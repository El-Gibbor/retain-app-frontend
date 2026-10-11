import type { AdminInsights } from '../types/admin';
import type { Category, CategoryDeletionResult, CategoryPayload } from '../types/category';
import { request } from './client';

export const adminApi = {
  insights: (signal?: AbortSignal) => request<AdminInsights>('/admin/insights', { signal }),
  createCategory: (payload: CategoryPayload) =>
    request<Category>('/admin/categories', { method: 'POST', body: payload }),
  renameCategory: (id: string, payload: CategoryPayload) =>
    request<Category>(`/admin/categories/${id}`, { method: 'PATCH', body: payload }),
  deleteCategory: (id: string) =>
    request<CategoryDeletionResult>(`/admin/categories/${id}`, { method: 'DELETE' }),
};
