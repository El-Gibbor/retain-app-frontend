import { Button, InputAdornment, Stack, TextField } from '@mui/material';
import { useState, type FormEvent } from 'react';
import { budgetsApi } from '../../api/budgets';
import { useNotify } from '../../hooks/useNotify';
import type { BudgetSummary } from '../../types/budget';
import { getErrorMessage, getFieldErrors } from '../../utils/errors';
import { formatMonth } from '../../utils/format';
import { validateAmount } from '../../utils/validation';

interface BudgetFormProps {
  month: string;
  current: number | null;
  onSaved: (summary: BudgetSummary) => void;
}

// Remount with key={month} so the field resets when the month changes
export default function BudgetForm({ month, current, onSaved }: BudgetFormProps) {
  const notify = useNotify();
  const [amount, setAmount] = useState(current === null ? '' : current.toFixed(2));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const unchanged = current !== null && Number(amount) === current;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateAmount(amount);
    setError(validationError);
    if (validationError) return;

    setSaving(true);
    try {
      const summary = await budgetsApi.set(month, Number(amount));
      onSaved(summary);
      notify(`Budget for ${formatMonth(month)} saved`);
    } catch (submitError) {
      setError(getFieldErrors(submitError).amount ?? getErrorMessage(submitError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack
      component="form"
      noValidate
      onSubmit={handleSubmit}
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1.5}
      sx={{ alignItems: { sm: 'flex-start' } }}
    >
      <TextField
        label={current === null ? 'Monthly budget' : 'Update budget'}
        value={amount}
        onChange={(event) => {
          setAmount(event.target.value);
          if (error) setError(null);
        }}
        error={Boolean(error)}
        helperText={error ?? ' '}
        slotProps={{
          input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
          htmlInput: { inputMode: 'decimal' },
        }}
        sx={{ maxWidth: { sm: 280 } }}
      />
      <Button
        type="submit"
        variant="contained"
        loading={saving}
        disabled={unchanged}
        sx={{ height: 56, flexShrink: 0, px: 3 }}
      >
        {current === null ? 'Set budget' : 'Save'}
      </Button>
    </Stack>
  );
}
