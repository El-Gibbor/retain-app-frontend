import { RestartAltOutlined } from '@mui/icons-material';
import { Box, Button, Stack, TextField } from '@mui/material';
import { useCallback } from 'react';
import {
  clearFilters,
  selectActiveFilterCount,
  selectExpenseFilters,
  setAmountRange,
  setCategoryIds,
  setDateRange,
  setPaymentMethods,
} from '../../store/expenseFiltersSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { Category } from '../../types/category';
import { PAYMENT_METHODS } from '../../types/expense';
import { PAYMENT_METHOD_LABELS } from '../../utils/format';
import DebouncedTextField from '../common/DebouncedTextField';
import MultiSelectFilter from '../common/MultiSelectFilter';

const PAYMENT_OPTIONS = PAYMENT_METHODS.map((method) => ({
  value: method,
  label: PAYMENT_METHOD_LABELS[method],
}));

const toAmount = (value: string): number | null => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};

const amountInputProps = { htmlInput: { min: 0, step: '1', inputMode: 'numeric' as const } };

interface ExpenseFilterPanelProps {
  categories: Category[];
}

export default function ExpenseFilterPanel({ categories }: ExpenseFilterPanelProps) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectExpenseFilters);
  const activeCount = useAppSelector(selectActiveFilterCount);
  const categoryOptions = categories.map((category) => ({ value: category.id, label: category.name }));

  const commitMin = useCallback(
    (value: string) => dispatch(setAmountRange({ min: toAmount(value), max: filters.maxAmount })),
    [dispatch, filters.maxAmount],
  );
  const commitMax = useCallback(
    (value: string) => dispatch(setAmountRange({ min: filters.minAmount, max: toAmount(value) })),
    [dispatch, filters.minAmount],
  );

  return (
    <Box
      sx={{
        pt: 2,
        display: 'grid',
        gap: 1.5,
        // minmax(0, 1fr) lets columns shrink below their content on narrow screens
        gridTemplateColumns: {
          xs: 'minmax(0, 1fr)',
          sm: 'repeat(2, minmax(0, 1fr))',
          lg: 'repeat(3, minmax(0, 1fr))',
        },
      }}
    >
      <MultiSelectFilter
        id="category-filter"
        label="Categories"
        options={categoryOptions}
        selected={filters.categoryIds}
        onChange={(ids) => dispatch(setCategoryIds(ids))}
        renderSummary={(ids) =>
          ids.length === 1
            ? (categoryOptions.find((option) => option.value === ids[0])?.label ?? '1 category')
            : `${ids.length} categories`
        }
      />

      <MultiSelectFilter
        id="payment-filter"
        label="Payment methods"
        options={PAYMENT_OPTIONS}
        selected={filters.paymentMethods}
        onChange={(methods) => dispatch(setPaymentMethods(methods))}
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ minWidth: 0 }}>
        <TextField
          label="From"
          type="date"
          size="small"
          value={filters.from ?? ''}
          onChange={(event) => dispatch(setDateRange({ min: event.target.value || null, max: filters.to }))}
          slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: filters.to ?? undefined } }}
        />
        <TextField
          label="To"
          type="date"
          size="small"
          value={filters.to ?? ''}
          onChange={(event) => dispatch(setDateRange({ min: filters.from, max: event.target.value || null }))}
          slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: filters.from ?? undefined } }}
        />
      </Stack>

      <Stack direction="row" spacing={1.5} sx={{ minWidth: 0 }}>
        {/* Keyed on resetCount so a clear from anywhere empties the local drafts */}
        <DebouncedTextField
          key={`min-${filters.resetCount}`}
          label="Min amount"
          type="number"
          size="small"
          initialValue={filters.minAmount?.toString() ?? ''}
          onCommit={commitMin}
          slotProps={amountInputProps}
        />
        <DebouncedTextField
          key={`max-${filters.resetCount}`}
          label="Max amount"
          type="number"
          size="small"
          initialValue={filters.maxAmount?.toString() ?? ''}
          onCommit={commitMax}
          slotProps={amountInputProps}
        />
      </Stack>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button
          onClick={() => dispatch(clearFilters())}
          disabled={activeCount === 0}
          startIcon={<RestartAltOutlined />}
          color="inherit"
        >
          Clear filters{activeCount > 0 ? ` (${activeCount})` : ''}
        </Button>
      </Box>
    </Box>
  );
}
