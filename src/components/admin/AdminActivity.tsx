import { Avatar, Card, CardContent, List, ListItem, Skeleton, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import type { AdminExpense } from '../../types/admin';
import type { User } from '../../types/auth';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/format';

function ActivityCard({
  title,
  loading,
  empty,
  children,
}: {
  title: string;
  loading: boolean;
  empty: boolean;
  children: ReactNode;
}) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
          {title}
        </Typography>
        {loading ? (
          Array.from({ length: 5 }, (_, index) => <Skeleton key={index} height={48} />)
        ) : empty ? (
          <Typography color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
            Nothing here yet.
          </Typography>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}

export function RecentPlatformExpenses({
  expenses,
  loading,
}: {
  expenses: AdminExpense[];
  loading: boolean;
}) {
  return (
    <ActivityCard title="Recently added expenses" loading={loading} empty={expenses.length === 0}>
      <List disablePadding aria-label="Recently added expenses">
        {expenses.map((expense) => (
          <ListItem key={expense.id} divider disableGutters sx={{ py: 1.25, gap: 2 }}>
            <Stack sx={{ minWidth: 0, flex: 1 }}>
              <Typography sx={{ fontWeight: 500 }} noWrap>
                {expense.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {expense.user.name} · {expense.category.name} · {formatDate(expense.date)}
              </Typography>
            </Stack>
            <Typography sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
              {formatCurrency(expense.amount)}
            </Typography>
          </ListItem>
        ))}
      </List>
    </ActivityCard>
  );
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

export function RecentUsers({ users, loading }: { users: User[]; loading: boolean }) {
  return (
    <ActivityCard title="Recently registered users" loading={loading} empty={users.length === 0}>
      <List disablePadding aria-label="Recently registered users">
        {users.map((user) => (
          <ListItem key={user.id} divider disableGutters sx={{ py: 1.25, gap: 1.5 }}>
            <Avatar
              sx={{ width: 36, height: 36, fontSize: 14, bgcolor: 'action.selected', color: 'primary.main' }}
            >
              {initials(user.name)}
            </Avatar>
            <Stack sx={{ minWidth: 0, flex: 1 }}>
              <Typography sx={{ fontWeight: 500 }} noWrap>
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {user.email}
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
              {formatDateTime(user.createdAt)}
            </Typography>
          </ListItem>
        ))}
      </List>
    </ActivityCard>
  );
}
