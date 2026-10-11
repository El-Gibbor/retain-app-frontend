import type { DashboardSummary } from '../types/dashboard';
import { request } from './client';

export const dashboardApi = {
  get: (month: string, signal?: AbortSignal) =>
    request<DashboardSummary>('/dashboard', { query: { month }, signal }),
};
