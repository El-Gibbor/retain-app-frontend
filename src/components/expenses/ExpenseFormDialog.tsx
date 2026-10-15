import { Close } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { expensesApi } from '../../api/expenses';
import type { Category } from '../../types/category';
import { PAYMENT_METHODS, type Expense, type ExpensePayload, type PaymentMethod } from '../../types/expense';
import { todayIso } from '../../utils/date';
import { getErrorMessage, getFieldErrors } from '../../utils/errors';
import { PAYMENT_METHOD_LABELS } from '../../utils/format';

interface ExpenseFormValues {
  title: string;
  amount: string;
  date: string;
  categoryId: string;
  paymentMethod: PaymentMethod | '';
  notes: string;
}

type ExpenseFormErrors = Partial<Record<keyof ExpenseFormValues, string>>;

const AMOUNT_PATTERN = /^\d+(\.\d{1,2})?$/;

const toFormValues = (expense: Expense | null): ExpenseFormValues => ({
  title: expense?.title ?? '',
  amount: expense ? expense.amount.toFixed(2) : '',
  date: expense?.date ?? todayIso(),
  categoryId: expense?.category.id ?? '',
  paymentMethod: expense?.paymentMethod ?? '',
  notes: expense?.notes ?? '',
});

const validate = (values: ExpenseFormValues): ExpenseFormErrors => {
  const errors: ExpenseFormErrors = {};
  if (!values.title.trim()) errors.title = 'Title is required';
  else if (values.title.trim().length > 120) errors.title = 'Title must be 120 characters or fewer';

  const amount = values.amount.trim();
  if (!amount) errors.amount = 'Amount is required';
  else if (!AMOUNT_PATTERN.test(amount)) errors.amount = 'Use a number with up to 2 decimal places';
  else if (Number(amount) <= 0) errors.amount = 'Amount must be greater than 0';

  if (!values.date) errors.date = 'Date is required';
  if (!values.categoryId) errors.categoryId = 'Choose a category';
  if (!values.paymentMethod) errors.paymentMethod = 'Choose a payment method';
  if (values.notes.length > 500) errors.notes = 'Notes must be 500 characters or fewer';
  return errors;
};

const toPayload = (values: ExpenseFormValues): ExpensePayload => ({
  title: values.title.trim(),
  amount: Number(values.amount),
  date: values.date,
  categoryId: values.categoryId,
  paymentMethod: values.paymentMethod as PaymentMethod,
  notes: values.notes.trim() || null,
});

interface ExpenseFormDialogProps {
  open: boolean;
  /** Expense being edited; null creates a new one */
  expense: Expense | null;
  categories: Category[];
  onClose: () => void;
  onSaved: (expense: Expense) => void;
}

function ExpenseForm({ expense, categories, onClose, onSaved }: Omit<ExpenseFormDialogProps, 'open'>) {
  const theme = useTheme();
  const isEdit = expense !== null;
  const [draft, setDraft] = useState<ExpenseFormValues>(() => toFormValues(expense));
  // Categories may still be loading when the form opens, so the default is derived each render
  const defaultCategoryId = categories.find((category) => category.isDefault)?.id ?? '';
  const values: ExpenseFormValues = { ...draft, categoryId: draft.categoryId || defaultCategoryId };
  const [errors, setErrors] = useState<ExpenseFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const update = (field: keyof ExpenseFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
    setDraft((current) => ({ ...current, [field]: event.target.value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setFormError(null);
    try {
      const payload = toPayload(values);
      const saved = isEdit
        ? await expensesApi.update(expense.id, payload)
        : await expensesApi.create(payload);
      onSaved(saved);
    } catch (error) {
      const fieldErrors = getFieldErrors(error);
      setErrors(fieldErrors);
      if (Object.keys(fieldErrors).length === 0) setFormError(getErrorMessage(error));
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open
      onClose={submitting ? undefined : onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      aria-labelledby="expense-form-title"
    >
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}
      >
        <DialogTitle id="expense-form-title" sx={{ pr: 6 }}>
          {isEdit ? 'Edit expense' : 'Add expense'}
          <IconButton
            aria-label="Close"
            onClick={onClose}
            disabled={submitting}
            sx={{ position: 'absolute', right: 12, top: 12 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5}>
            {formError && <Alert severity="error">{formError}</Alert>}
            <TextField
              label="Title"
              value={values.title}
              onChange={update('title')}
              error={Boolean(errors.title)}
              helperText={errors.title}
              autoFocus
              required
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Amount"
                value={values.amount}
                onChange={update('amount')}
                error={Boolean(errors.amount)}
                helperText={errors.amount}
                required
                slotProps={{
                  input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
                  htmlInput: { inputMode: 'decimal' },
                }}
              />
              <TextField
                label="Date"
                type="date"
                value={values.date}
                onChange={update('date')}
                error={Boolean(errors.date)}
                helperText={errors.date}
                required
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                select
                label="Category"
                value={values.categoryId}
                onChange={update('categoryId')}
                error={Boolean(errors.categoryId)}
                helperText={errors.categoryId}
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Payment method"
                value={values.paymentMethod}
                onChange={update('paymentMethod')}
                error={Boolean(errors.paymentMethod)}
                helperText={errors.paymentMethod}
                required
              >
                {PAYMENT_METHODS.map((method) => (
                  <MenuItem key={method} value={method}>
                    {PAYMENT_METHOD_LABELS[method]}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <TextField
              label="Notes"
              value={values.notes}
              onChange={update('notes')}
              error={Boolean(errors.notes)}
              helperText={errors.notes ?? `${values.notes.length}/500`}
              multiline
              minRows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={submitting} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" loading={submitting}>
            {isEdit ? 'Save changes' : 'Add expense'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

// The form mounts fresh on every open, so it always starts from the current expense
export default function ExpenseFormDialog({ open, ...props }: ExpenseFormDialogProps) {
  return open ? <ExpenseForm {...props} /> : null;
}
