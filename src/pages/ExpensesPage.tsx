import { AddOutlined, ReceiptLongOutlined, SearchOffOutlined } from '@mui/icons-material';
import { Alert, Box, Button, Card, Divider, LinearProgress, TablePagination } from '@mui/material';
import { useState } from 'react';
import EmptyState from '../components/common/EmptyState';
import PageHeader from '../components/common/PageHeader';
import ExpenseFilterBar from '../components/expenses/ExpenseFilterBar';
import ExpenseFormDialog from '../components/expenses/ExpenseFormDialog';
import ExpenseList from '../components/expenses/ExpenseList';
import { useCategories } from '../hooks/useCategories';
import { useExpenses } from '../hooks/useExpenses';
import { useNotify } from '../hooks/useNotify';
import {
  clearFilters,
  PAGE_SIZE_OPTIONS,
  selectActiveFilterCount,
  selectExpenseFilters,
  selectExpenseQuery,
  setLimit,
  setPage,
} from '../store/expenseFiltersSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { Expense } from '../types/expense';

type FormState = { open: false } | { open: true; expense: Expense | null };

export default function ExpensesPage() {
  const dispatch = useAppDispatch();
  const query = useAppSelector(selectExpenseQuery);
  const { page, limit } = useAppSelector(selectExpenseFilters);
  const activeFilterCount = useAppSelector(selectActiveFilterCount);
  const { categories } = useCategories();
  const { result, loading, error, reload } = useExpenses(query);
  const notify = useNotify();
  const [form, setForm] = useState<FormState>({ open: false });

  const openCreate = () => setForm({ open: true, expense: null });
  const openEdit = (expense: Expense) => setForm({ open: true, expense });

  const handleSaved = (saved: Expense) => {
    const wasEdit = form.open && form.expense !== null;
    setForm({ open: false });
    notify(wasEdit ? `Updated "${saved.title}"` : `Added "${saved.title}"`);
    reload();
  };

  const expenses = result?.data ?? [];
  const total = result?.pagination.total ?? 0;
  const firstLoad = loading && !result;

  return (
    <>
      <PageHeader
        title="Expenses"
        subtitle="Record, search and manage your spending."
        actions={
          <Button variant="contained" startIcon={<AddOutlined />} onClick={openCreate} fullWidth>
            Add expense
          </Button>
        }
      />

      <Card>
        <ExpenseFilterBar categories={categories} />
        <Divider />
        <Box sx={{ height: 4 }}>{loading && !firstLoad && <LinearProgress aria-label="Updating results" />}</Box>

        {error && (
          <Alert
            severity="error"
            sx={{ m: 2 }}
            action={
              <Button color="inherit" size="small" onClick={reload}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {firstLoad ? (
          <ExpenseList expenses={[]} skeletonRows={5} />
        ) : expenses.length > 0 ? (
          <>
            <ExpenseList expenses={expenses} onEdit={openEdit} />
            <TablePagination
              component="div"
              count={total}
              page={page - 1}
              onPageChange={(_, nextPage) => dispatch(setPage(nextPage + 1))}
              rowsPerPage={limit}
              rowsPerPageOptions={[...PAGE_SIZE_OPTIONS]}
              onRowsPerPageChange={(event) => dispatch(setLimit(Number(event.target.value)))}
              labelRowsPerPage="Per page"
            />
          </>
        ) : (
          !error &&
          (activeFilterCount > 0 ? (
            <EmptyState
              icon={<SearchOffOutlined />}
              title="No expenses match your filters"
              description="Try widening the date range or removing a filter."
              action={
                <Button variant="outlined" onClick={() => dispatch(clearFilters())}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={<ReceiptLongOutlined />}
              title="No expenses yet"
              description="Record your first expense to start tracking your spending."
              action={
                <Button variant="contained" startIcon={<AddOutlined />} onClick={openCreate}>
                  Add expense
                </Button>
              }
            />
          ))
        )}
      </Card>

      <ExpenseFormDialog
        open={form.open}
        expense={form.open ? form.expense : null}
        categories={categories}
        onClose={() => setForm({ open: false })}
        onSaved={handleSaved}
      />
    </>
  );
}
