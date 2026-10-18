import { Alert, Box } from '@mui/material';
import type { AdminInsights } from '../../types/admin';
import { formatCurrency, formatMonth } from '../../utils/format';
import { currentMonth } from '../../utils/date';
import CategorySpendingChart from '../dashboard/CategorySpendingChart';
import StatTile from '../dashboard/StatTile';
import { RecentPlatformExpenses, RecentUsers } from './AdminActivity';
import RankedCategories from './RankedCategories';

interface InsightsPanelProps {
  insights: AdminInsights | null;
  loading: boolean;
  error: string | null;
}

const twoColumns = { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' };

export default function InsightsPanel({ insights, loading, error }: InsightsPanelProps) {
  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      {error && <Alert severity="error">{error}</Alert>}

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: 'minmax(0, 1fr)',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))',
          },
        }}
      >
        <StatTile
          label="Total value recorded"
          value={formatCurrency(insights?.totalExpenseValue ?? 0)}
          hero
          loading={loading}
        />
        <StatTile label="Registered users" value={insights?.totalUsers ?? 0} loading={loading} />
        <StatTile label="Expenses recorded" value={insights?.totalExpenses ?? 0} loading={loading} />
        <StatTile
          label={`Expenses in ${formatMonth(currentMonth())}`}
          value={insights?.expensesThisMonth ?? 0}
          loading={loading}
        />
      </Box>

      <CategorySpendingChart
        title="Total spending per category"
        emptyMessage="No expenses recorded on the platform yet."
        data={insights?.spendingByCategory ?? []}
        loading={loading}
      />

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: twoColumns }}>
        <RankedCategories
          title="Most-used categories"
          description="Top 5 by number of expenses"
          items={insights?.topCategories ?? []}
          loading={loading}
        />
        <RankedCategories
          title="Least-used categories"
          description="Bottom 5 by number of expenses"
          items={insights?.bottomCategories ?? []}
          loading={loading}
        />
      </Box>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: twoColumns }}>
        <RecentPlatformExpenses expenses={insights?.recentExpenses ?? []} loading={loading} />
        <RecentUsers users={insights?.recentUsers ?? []} loading={loading} />
      </Box>
    </Box>
  );
}
