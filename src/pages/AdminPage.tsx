import { Box, Tab, Tabs } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import CategoryManager from '../components/admin/CategoryManager';
import InsightsPanel from '../components/admin/InsightsPanel';
import PageHeader from '../components/common/PageHeader';
import { useAdminInsights } from '../hooks/useAdminInsights';
import { useCategories } from '../hooks/useCategories';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

type AdminTab = 'insights' | 'categories';

export default function AdminPage() {
  useDocumentTitle('Admin');
  const [searchParams, setSearchParams] = useSearchParams();
  const tab: AdminTab = searchParams.get('tab') === 'categories' ? 'categories' : 'insights';
  const [insightsKey, setInsightsKey] = useState(0);
  const { insights, loading: insightsLoading, error: insightsError } = useAdminInsights(insightsKey);
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    reload: reloadCategories,
  } = useCategories();

  const usage = useMemo(
    () =>
      Object.fromEntries((insights?.spendingByCategory ?? []).map((item) => [item.categoryId, item.count])),
    [insights],
  );

  // Category changes affect both the list and the insights figures
  const handleCategoriesChanged = useCallback(() => {
    reloadCategories();
    setInsightsKey((key) => key + 1);
  }, [reloadCategories]);

  return (
    <>
      <PageHeader title="Admin dashboard" subtitle="Manage categories and review platform activity." />

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={tab}
          onChange={(_, next: AdminTab) =>
            setSearchParams(next === 'insights' ? {} : { tab: next }, { replace: true })
          }
          aria-label="Admin sections"
        >
          <Tab
            label="Insights"
            value="insights"
            id="admin-tab-insights"
            aria-controls="admin-panel-insights"
          />
          <Tab
            label="Categories"
            value="categories"
            id="admin-tab-categories"
            aria-controls="admin-panel-categories"
          />
        </Tabs>
      </Box>

      <Box role="tabpanel" id={`admin-panel-${tab}`} aria-labelledby={`admin-tab-${tab}`}>
        {tab === 'insights' ? (
          <InsightsPanel insights={insights} loading={insightsLoading} error={insightsError} />
        ) : (
          <CategoryManager
            categories={categories}
            usage={usage}
            loading={categoriesLoading}
            error={categoriesError}
            onChanged={handleCategoriesChanged}
          />
        )}
      </Box>
    </>
  );
}
