import { Box, Collapse, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { selectActiveFilterCount, selectExpenseFilters } from '../../store/expenseFiltersSlice';
import { useAppSelector } from '../../store/hooks';
import type { Category } from '../../types/category';
import ExpenseFilterPanel from './ExpenseFilterPanel';
import ExpenseSearchSortBar from './ExpenseSearchSortBar';

interface ExpenseFilterBarProps {
  categories: Category[];
}

export default function ExpenseFilterBar({ categories }: ExpenseFilterBarProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  // Panel starts open on desktop and collapsed on phones
  const [expanded, setExpanded] = useState(isDesktop);
  const activeCount = useAppSelector(selectActiveFilterCount);
  const { search } = useAppSelector(selectExpenseFilters);
  const panelFilterCount = activeCount - (search.trim() ? 1 : 0);

  return (
    <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
      <ExpenseSearchSortBar
        filtersOpen={expanded}
        onToggleFilters={() => setExpanded((open) => !open)}
        panelFilterCount={panelFilterCount}
      />
      <Collapse in={expanded} id="expense-filter-panel">
        <ExpenseFilterPanel categories={categories} />
      </Collapse>
    </Box>
  );
}
