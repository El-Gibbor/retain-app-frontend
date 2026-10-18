import { dashboardApi } from '../api/dashboard';
import { useApiQuery } from './useApiQuery';

export function useDashboard(month: string) {
  // reload() keeps the current figures on screen; only a month change shows skeletons
  const { data, error, loading, reload } = useApiQuery(`dashboard:${month}`, (signal) =>
    dashboardApi.get(month, signal),
  );
  return { summary: data, error, loading, reload };
}
