import { useState } from 'react';
import { expensesApi } from '../../api/expenses';
import { useNotify } from '../../hooks/useNotify';
import type { Expense } from '../../types/expense';
import { getErrorMessage } from '../../utils/errors';
import { formatCurrency } from '../../utils/format';
import ConfirmDialog from '../common/ConfirmDialog';

interface DeleteExpenseDialogProps {
  expense: Expense | null;
  onClose: () => void;
  onDeleted: (expense: Expense) => void;
}

export default function DeleteExpenseDialog({ expense, onClose, onDeleted }: DeleteExpenseDialogProps) {
  const notify = useNotify();
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!expense) return;
    setDeleting(true);
    try {
      await expensesApi.remove(expense.id);
      notify(`Deleted "${expense.title}"`);
      onDeleted(expense);
    } catch (error) {
      notify(getErrorMessage(error), 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <ConfirmDialog
      open={expense !== null}
      title="Delete expense?"
      message={
        expense && (
          <>
            <strong>{expense.title}</strong> ({formatCurrency(expense.amount)}) will be permanently removed.
            This cannot be undone.
          </>
        )
      }
      confirmLabel="Delete"
      destructive
      loading={deleting}
      onConfirm={handleConfirm}
      onClose={onClose}
    />
  );
}
