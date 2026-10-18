import { Alert, Box, Chip, LinearProgress, Link, Typography } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router';
import MonthPicker from '../components/common/MonthPicker';
import PageHeader from '../components/common/PageHeader';
import CategorySpendingChart from '../components/dashboard/CategorySpendingChart';
import RecentExpenses from '../components/dashboard/RecentExpenses';
import StatTile from '../components/dashboard/StatTile';
import ExpenseFormDialog from '../components/expenses/ExpenseFormDialog';
import { useAuth } from '../hooks/useAuth';
import { useCategories } from '../hooks/useCategories';
import { useDashboard } from '../hooks/useDashboard';
import { useNotify } from '../hooks/useNotify';
import { BUDGET_STATUS } from '../utils/budget';
import { currentMonth, isValidMonth } from '../utils/date';
import { formatCurrency, formatMonth } from '../utils/format';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function DashboardPage() {
  useDocumentTitle('Dashboard');
  const { user } = useAuth();
  const notify = useNotify();
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get('month');
  const month = isValidMonth(requested) ? requested : currentMonth();
  const [refreshKey, setRefreshKey] = useState(0);
  const { summary, loading, error } = useDashboard(month, refreshKey);
  const { categories } = useCategories();
  const [adding, setAdding] = useState(false);

  const firstName = user?.name.split(' ')[0] ?? '';
  const budget = summary?.budget;
  const status = budget ? BUDGET_STATUS[budget.status] : null;
  const over = budget?.remaining !== null && budget?.remaining !== undefined && budget.remaining < 0;

  return (
    <>
      <PageHeader
        title={`Welcome back, ${firstName}`}
        subtitle={`Here is how ${month === currentMonth() ? 'your month' : formatMonth(month)} is going.`}
        actions={
          <MonthPicker
            month={month}
            onChange={(next) => setSearchParams({ month: next }, { replace: true })}
          />
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: 'minmax(0, 1fr)',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))',
          },
          mb: 2,
        }}
      >
        <StatTile label="Total spent" value={formatCurrency(budget?.spent ?? 0)} hero loading={loading}>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {formatMonth(month)}
          </Typography>
        </StatTile>

        <StatTile
          label={over ? 'Over budget by' : 'Remaining budget'}
          value={
            budget?.remaining === null || budget?.remaining === undefined
              ? 'Not set'
              : formatCurrency(Math.abs(budget.remaining))
          }
          loading={loading}
        >
          {budget && status && budget.budget !== null ? (
            <>
              <LinearProgress
                variant="determinate"
                value={Math.min(budget.percentUsed ?? 0, 100)}
                color={status.color}
                aria-label={`${budget.percentUsed}% of budget used`}
                sx={{ height: 8, borderRadius: 4, mt: 1.5, mb: 1 }}
              />
              <Chip label={status.label} color={status.color} size="small" />
              <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
                of {formatCurrency(budget.budget)}
              </Typography>
            </>
          ) : (
            <Link
              component={RouterLink}
              to={`/budget?month=${month}`}
              variant="body2"
              sx={{ display: 'inline-block', mt: 1 }}
            >
              Set a budget for {formatMonth(month)}
            </Link>
          )}
        </StatTile>

        <StatTile
          label="Highest expense"
          value={summary?.highestExpense ? formatCurrency(summary.highestExpense.amount) : '—'}
          loading={loading}
        >
          {summary?.highestExpense && (
            <Link
              component={RouterLink}
              to={`/expenses/${summary.highestExpense.id}`}
              variant="body2"
              color="text.secondary"
              underline="hover"
              noWrap
              sx={{ display: 'block', mt: 1 }}
            >
              {summary.highestExpense.title}
            </Link>
          )}
        </StatTile>

        <StatTile label="Expenses recorded" value={summary?.expenseCount ?? 0} loading={loading}>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            in {formatMonth(month)}
          </Typography>
        </StatTile>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 7fr) minmax(0, 5fr)' },
        }}
      >
        <CategorySpendingChart data={summary?.spendingByCategory ?? []} loading={loading} />
        <RecentExpenses
          expenses={summary?.recentExpenses ?? []}
          loading={loading}
          onAdd={() => setAdding(true)}
        />
      </Box>

      <ExpenseFormDialog
        open={adding}
        expense={null}
        categories={categories}
        onClose={() => setAdding(false)}
        onSaved={(saved) => {
          setAdding(false);
          notify(`Added "${saved.title}"`);
          setRefreshKey((key) => key + 1);
        }}
      />
    </>
  );
}
