import { FilterListOutlined, RestartAltOutlined, SearchOutlined } from '@mui/icons-material';
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Collapse,
  FormControl,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  useMediaQuery,
  type SelectChangeEvent,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  clearFilters,
  selectActiveFilterCount,
  selectExpenseFilters,
  setAmountRange,
  setCategoryIds,
  setDateRange,
  setPaymentMethods,
  setSearch,
  setSort,
} from '../../store/expenseFiltersSlice';
import type { Category } from '../../types/category';
import { PAYMENT_METHODS, type PaymentMethod, type SortBy, type SortOrder } from '../../types/expense';
import { PAYMENT_METHOD_LABELS } from '../../utils/format';
import DebouncedTextField from '../common/DebouncedTextField';

const SORT_OPTIONS: { value: `${SortBy}:${SortOrder}`; label: string }[] = [
  { value: 'date:desc', label: 'Newest first' },
  { value: 'date:asc', label: 'Oldest first' },
  { value: 'amount:desc', label: 'Highest amount' },
  { value: 'amount:asc', label: 'Lowest amount' },
];

const toAmount = (value: string): number | null => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};

interface ExpenseFilterBarProps {
  categories: Category[];
}

export default function ExpenseFilterBar({ categories }: ExpenseFilterBarProps) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectExpenseFilters);
  const activeCount = useAppSelector(selectActiveFilterCount);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [expanded, setExpanded] = useState(isDesktop);
  // Remounts the debounced inputs whenever filters are cleared, from here or elsewhere
  const resetKey = filters.resetCount;

  const commitSearch = useCallback((value: string) => dispatch(setSearch(value)), [dispatch]);
  const commitMin = useCallback(
    (value: string) => dispatch(setAmountRange({ min: toAmount(value), max: filters.maxAmount })),
    [dispatch, filters.maxAmount],
  );
  const commitMax = useCallback(
    (value: string) => dispatch(setAmountRange({ min: filters.minAmount, max: toAmount(value) })),
    [dispatch, filters.minAmount],
  );

  const handleSort = (event: SelectChangeEvent) => {
    const [sortBy, sortOrder] = event.target.value.split(':') as [SortBy, SortOrder];
    dispatch(setSort({ sortBy, sortOrder }));
  };


  const categoryName = (id: string) => categories.find((category) => category.id === id)?.name ?? 'Unknown';
  const searchActive = filters.search.trim() !== '';
  const panelCount = activeCount - (searchActive ? 1 : 0);

  return (
    <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <DebouncedTextField
          key={`search-${resetKey}`}
          initialValue={filters.search}
          onCommit={commitSearch}
          placeholder="Search by title or notes"
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined fontSize="small" />
                </InputAdornment>
              ),
            },
            htmlInput: { 'aria-label': 'Search expenses' },
          }}
        />
        <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0 }}>
          <FormControl size="small" sx={{ minWidth: 170, flex: { xs: 1, sm: 'none' } }}>
            <InputLabel id="sort-label">Sort by</InputLabel>
            <Select
              labelId="sort-label"
              label="Sort by"
              value={`${filters.sortBy}:${filters.sortOrder}`}
              onChange={handleSort}
            >
              {SORT_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant={expanded ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => setExpanded((open) => !open)}
            aria-expanded={expanded}
            aria-controls="expense-filter-panel"
            startIcon={
              <Badge badgeContent={panelCount} color="primary" invisible={expanded || panelCount === 0}>
                <FilterListOutlined />
              </Badge>
            }
          >
            Filters
          </Button>
        </Stack>
      </Stack>

      <Collapse in={expanded} id="expense-filter-panel">
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
          <FormControl size="small" fullWidth>
            <InputLabel id="category-filter-label">Categories</InputLabel>
            <Select<string[]>
              labelId="category-filter-label"
              multiple
              value={filters.categoryIds}
              onChange={(event: SelectChangeEvent<string[]>) => {
                const { value } = event.target;
                dispatch(setCategoryIds(typeof value === 'string' ? value.split(',') : value));
              }}
              input={<OutlinedInput label="Categories" />}
              renderValue={(selected) =>
                selected.length === 1 ? categoryName(selected[0]) : `${selected.length} categories`
              }
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  <Checkbox size="small" checked={filters.categoryIds.includes(category.id)} />
                  <ListItemText primary={category.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel id="payment-filter-label">Payment methods</InputLabel>
            <Select<PaymentMethod[]>
              labelId="payment-filter-label"
              multiple
              value={filters.paymentMethods}
              onChange={(event: SelectChangeEvent<PaymentMethod[]>) => {
                const { value } = event.target;
                dispatch(
                  setPaymentMethods(typeof value === 'string' ? (value.split(',') as PaymentMethod[]) : value),
                );
              }}
              input={<OutlinedInput label="Payment methods" />}
              renderValue={(selected) => selected.map((method) => PAYMENT_METHOD_LABELS[method]).join(', ')}
            >
              {PAYMENT_METHODS.map((method) => (
                <MenuItem key={method} value={method}>
                  <Checkbox size="small" checked={filters.paymentMethods.includes(method)} />
                  <ListItemText primary={PAYMENT_METHOD_LABELS[method]} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
            <DebouncedTextField
              key={`min-${resetKey}`}
              label="Min amount"
              type="number"
              size="small"
              initialValue={filters.minAmount?.toString() ?? ''}
              onCommit={commitMin}
              slotProps={{ htmlInput: { min: 0, step: '0.01', inputMode: 'decimal' } }}
            />
            <DebouncedTextField
              key={`max-${resetKey}`}
              label="Max amount"
              type="number"
              size="small"
              initialValue={filters.maxAmount?.toString() ?? ''}
              onCommit={commitMax}
              slotProps={{ htmlInput: { min: 0, step: '0.01', inputMode: 'decimal' } }}
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
      </Collapse>
    </Box>
  );
}
