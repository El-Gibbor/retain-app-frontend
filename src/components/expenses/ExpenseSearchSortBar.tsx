import { FilterListOutlined, SearchOutlined } from '@mui/icons-material';
import {
  Badge,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  type SelectChangeEvent,
} from '@mui/material';
import { useCallback } from 'react';
import { selectExpenseFilters, setSearch, setSort } from '../../store/expenseFiltersSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { SortBy, SortOrder } from '../../types/expense';
import DebouncedTextField from '../common/DebouncedTextField';

interface SortOption {
  value: `${SortBy}:${SortOrder}`;
  label: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
}

const SORT_OPTIONS: SortOption[] = [
  { value: 'date:desc', label: 'Newest first', sortBy: 'date', sortOrder: 'desc' },
  { value: 'date:asc', label: 'Oldest first', sortBy: 'date', sortOrder: 'asc' },
  { value: 'amount:desc', label: 'Highest amount', sortBy: 'amount', sortOrder: 'desc' },
  { value: 'amount:asc', label: 'Lowest amount', sortBy: 'amount', sortOrder: 'asc' },
];

interface ExpenseSearchSortBarProps {
  filtersOpen: boolean;
  onToggleFilters: () => void;
  /** Active filters inside the collapsible panel, shown as a badge while it is closed */
  panelFilterCount: number;
}

export default function ExpenseSearchSortBar({
  filtersOpen,
  onToggleFilters,
  panelFilterCount,
}: ExpenseSearchSortBarProps) {
  const dispatch = useAppDispatch();
  const { search, sortBy, sortOrder, resetCount } = useAppSelector(selectExpenseFilters);
  const commitSearch = useCallback((value: string) => dispatch(setSearch(value)), [dispatch]);

  const handleSort = (event: SelectChangeEvent) => {
    const option = SORT_OPTIONS.find((candidate) => candidate.value === event.target.value);
    if (option) dispatch(setSort({ sortBy: option.sortBy, sortOrder: option.sortOrder }));
  };

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
      <DebouncedTextField
        // Remounts on every clear so the field drops its local draft
        key={`search-${resetCount}`}
        initialValue={search}
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
          <Select labelId="sort-label" label="Sort by" value={`${sortBy}:${sortOrder}`} onChange={handleSort}>
            {SORT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant={filtersOpen ? 'contained' : 'outlined'}
          onClick={onToggleFilters}
          aria-expanded={filtersOpen}
          aria-controls="expense-filter-panel"
          startIcon={
            <Badge
              badgeContent={panelFilterCount}
              color="primary"
              invisible={filtersOpen || panelFilterCount === 0}
            >
              <FilterListOutlined />
            </Badge>
          }
        >
          Filters
        </Button>
      </Stack>
    </Stack>
  );
}
