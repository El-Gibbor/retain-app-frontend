import type { BudgetSummary } from '../types/budget';
import { request } from './client';

export const budgetsApi = {
  get: (month: string, signal?: AbortSignal) =>
    request<BudgetSummary>(`/budgets/${month}`, { signal }),
  set: (month: string, amount: number) =>
    request<BudgetSummary>(`/budgets/${month}`, { method: 'PUT', body: { amount } }),
};
