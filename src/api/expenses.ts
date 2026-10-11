import type { Expense, ExpensePayload, ExpenseQuery, Paginated } from '../types/expense';
import { request } from './client';

export const expensesApi = {
  list: (query: ExpenseQuery, signal?: AbortSignal) =>
    request<Paginated<Expense>>('/expenses', { query: { ...query }, signal }),
  get: (id: string, signal?: AbortSignal) => request<Expense>(`/expenses/${id}`, { signal }),
  create: (payload: ExpensePayload) =>
    request<Expense>('/expenses', { method: 'POST', body: payload }),
  update: (id: string, payload: Partial<ExpensePayload>) =>
    request<Expense>(`/expenses/${id}`, { method: 'PATCH', body: payload }),
  remove: (id: string) => request<void>(`/expenses/${id}`, { method: 'DELETE' }),
};
