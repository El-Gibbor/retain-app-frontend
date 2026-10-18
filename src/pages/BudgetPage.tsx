import { ReceiptLongOutlined } from '@mui/icons-material';
import { Alert, Box, Button, Card, CardContent, Divider, Skeleton, Stack, Typography } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router';
import BudgetForm from '../components/budget/BudgetForm';
import BudgetProgress from '../components/budget/BudgetProgress';
import MonthPicker from '../components/common/MonthPicker';
import PageHeader from '../components/common/PageHeader';
import { useBudget } from '../hooks/useBudget';
import { clearFilters, setDateRange } from '../store/expenseFiltersSlice';
import { useAppDispatch } from '../store/hooks';
import { currentMonth, isValidMonth, monthBounds } from '../utils/date';
import { formatMonth } from '../utils/format';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function BudgetPage() {
  useDocumentTitle('Budget');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get('month');
  // Month lives in the URL so a reload or shared link keeps the same view
  const month = isValidMonth(requested) ? requested : currentMonth();
  const { summary, loading, error, replace } = useBudget(month);

  const changeMonth = (next: string) => setSearchParams({ month: next }, { replace: true });

  const viewMonthExpenses = () => {
    const { from, to } = monthBounds(month);
    dispatch(clearFilters());
    dispatch(setDateRange({ min: from, max: to }));
    navigate('/expenses');
  };

  return (
    <>
      <PageHeader
        title="Budget"
        subtitle="Set a monthly limit and see how close you are to it."
        actions={<MonthPicker month={month} onChange={changeMonth} />}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {formatMonth(month)}
          </Typography>

          {loading || !summary ? (
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Skeleton variant="rounded" width={140} height={24} />
              <Skeleton variant="rounded" height={10} />
              <Skeleton variant="rounded" height={64} />
            </Stack>
          ) : (
            <>
              <Box sx={{ mt: 2 }}>
                <BudgetProgress summary={summary} />
              </Box>
              <Divider sx={{ my: 3 }} />
              <BudgetForm key={month} month={month} current={summary.budget} onSaved={replace} />
              <Button startIcon={<ReceiptLongOutlined />} onClick={viewMonthExpenses} sx={{ mt: 1 }}>
                View expenses for {formatMonth(month)}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
