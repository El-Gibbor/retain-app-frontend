import { Button, Card, CardContent, Link, List, ListItem, Skeleton, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import type { Expense } from '../../types/expense';
import { formatCurrency, formatDate } from '../../utils/format';

interface RecentExpensesProps {
  expenses: Expense[];
  loading: boolean;
  onAdd: () => void;
}

export default function RecentExpenses({ expenses, loading, onAdd }: RecentExpensesProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" component="h2">
            Recent expenses
          </Typography>
          <Button component={RouterLink} to="/expenses" size="small">
            View all
          </Button>
        </Stack>

        {loading ? (
          Array.from({ length: 4 }, (_, index) => <Skeleton key={index} height={48} />)
        ) : expenses.length === 0 ? (
          <Stack spacing={1.5} sx={{ py: 4, alignItems: 'center', textAlign: 'center' }}>
            <Typography color="text.secondary">No expenses recorded this month.</Typography>
            <Button variant="outlined" onClick={onAdd}>
              Add expense
            </Button>
          </Stack>
        ) : (
          <List disablePadding aria-label="Recent expenses">
            {expenses.map((expense) => (
              <ListItem key={expense.id} divider disableGutters sx={{ py: 1.25, gap: 2 }}>
                <Stack sx={{ minWidth: 0, flex: 1 }}>
                  <Link
                    component={RouterLink}
                    to={`/expenses/${expense.id}`}
                    color="inherit"
                    underline="hover"
                    noWrap
                    sx={{ fontWeight: 500 }}
                  >
                    {expense.title}
                  </Link>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {expense.category.name} · {formatDate(expense.date)}
                  </Typography>
                </Stack>
                <Typography sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {formatCurrency(expense.amount)}
                </Typography>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
