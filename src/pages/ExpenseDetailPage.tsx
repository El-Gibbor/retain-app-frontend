import { ArrowBackOutlined, DeleteOutlined, EditOutlined, SearchOffOutlined } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useState, type ReactNode } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router';
import EmptyState from '../components/common/EmptyState';
import DeleteExpenseDialog from '../components/expenses/DeleteExpenseDialog';
import ExpenseFormDialog from '../components/expenses/ExpenseFormDialog';
import { useCategories } from '../hooks/useCategories';
import { useExpense } from '../hooks/useExpense';
import { useNotify } from '../hooks/useNotify';
import type { Expense } from '../types/expense';
import { formatCurrency, formatDate, formatDateTime, PAYMENT_METHOD_LABELS } from '../utils/format';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '180px 1fr' },
        gap: { xs: 0.5, sm: 2 },
        py: 1.75,
      }}
    >
      <Typography color="text.secondary">{label}</Typography>
      <Box sx={{ minWidth: 0 }}>{children}</Box>
    </Box>
  );
}

export default function ExpenseDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const notify = useNotify();
  const { expense, loading, error, notFound, replace } = useExpense(id);
  useDocumentTitle(expense?.title ?? 'Expense');
  const { categories } = useCategories();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState<Expense | null>(null);

  const backLink = (
    <Button
      component={RouterLink}
      to="/expenses"
      startIcon={<ArrowBackOutlined />}
      color="inherit"
      sx={{ mb: 2 }}
    >
      Back to expenses
    </Button>
  );

  if (notFound) {
    return (
      <>
        {backLink}
        <Card>
          <EmptyState
            icon={<SearchOffOutlined />}
            title="Expense not found"
            description="It may have been deleted, or it belongs to another account."
          />
        </Card>
      </>
    );
  }

  return (
    <>
      {backLink}
      {error && <Alert severity="error">{error}</Alert>}

      <Card>
        <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
          {loading || !expense ? (
            <Stack spacing={1.5}>
              <Skeleton variant="text" width="50%" height={44} />
              <Skeleton variant="text" width="30%" height={56} />
              <Skeleton variant="rounded" height={160} />
            </Stack>
          ) : (
            <>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'flex-start' } }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="h4" component="h1" sx={{ overflowWrap: 'anywhere' }}>
                    {expense.title}
                  </Typography>
                  <Typography variant="h3" component="p" color="primary" sx={{ mt: 1, fontWeight: 600 }}>
                    {formatCurrency(expense.amount)}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0 }}>
                  <Button
                    variant="outlined"
                    startIcon={<EditOutlined />}
                    onClick={() => setEditing(true)}
                    sx={{ flex: { xs: 1, sm: 'none' } }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteOutlined />}
                    onClick={() => setDeleting(expense)}
                    sx={{ flex: { xs: 1, sm: 'none' } }}
                  >
                    Delete
                  </Button>
                </Stack>
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Box>
                <DetailRow label="Category">
                  <Chip label={expense.category.name} size="small" variant="outlined" />
                </DetailRow>
                <DetailRow label="Date">
                  <Typography>{formatDate(expense.date)}</Typography>
                </DetailRow>
                <DetailRow label="Payment method">
                  <Typography>{PAYMENT_METHOD_LABELS[expense.paymentMethod]}</Typography>
                </DetailRow>
                <DetailRow label="Notes">
                  <Typography
                    color={expense.notes ? 'text.primary' : 'text.secondary'}
                    sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
                  >
                    {expense.notes ?? 'No notes'}
                  </Typography>
                </DetailRow>
                <DetailRow label="Recorded">
                  <Typography>{formatDateTime(expense.createdAt)}</Typography>
                </DetailRow>
                {expense.updatedAt !== expense.createdAt && (
                  <DetailRow label="Last updated">
                    <Typography>{formatDateTime(expense.updatedAt)}</Typography>
                  </DetailRow>
                )}
              </Box>
            </>
          )}
        </CardContent>
      </Card>

      <ExpenseFormDialog
        open={editing}
        expense={expense}
        categories={categories}
        onClose={() => setEditing(false)}
        onSaved={(saved) => {
          setEditing(false);
          replace(saved);
          notify(`Updated "${saved.title}"`);
        }}
      />
      <DeleteExpenseDialog
        expense={deleting}
        onClose={() => setDeleting(null)}
        onDeleted={() => navigate('/expenses', { replace: true })}
      />
    </>
  );
}
