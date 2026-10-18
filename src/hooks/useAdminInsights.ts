import { adminApi } from '../api/admin';
import { useApiQuery } from './useApiQuery';

export function useAdminInsights() {
  // Refreshes after category changes keep the old figures visible
  const { data, error, loading, reload } = useApiQuery('admin:insights', (signal) =>
    adminApi.insights(signal),
  );
  return { insights: data, error, loading, reload };
}
