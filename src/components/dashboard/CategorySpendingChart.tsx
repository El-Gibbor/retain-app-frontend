import { BarChartOutlined, TableRowsOutlined } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import type { CategorySpending } from '../../types/dashboard';
import { formatCurrency } from '../../utils/format';

// Admin data has no percentage, so it is derived from the totals when missing
type CategoryBar = Pick<CategorySpending, 'categoryId' | 'name' | 'total' | 'count'> & {
  percentage?: number;
};

interface CategorySpendingChartProps {
  data: CategoryBar[];
  title?: string;
  emptyMessage?: string;
  loading: boolean;
}

type View = 'chart' | 'table';

const BAR_THICKNESS = 20;

function BarChart({ data }: { data: CategorySpending[] }) {
  const max = Math.max(...data.map((item) => item.total));

  return (
    <Stack
      component="ul"
      spacing={1.5}
      sx={{ listStyle: 'none', p: 0, m: 0 }}
      aria-label="Spending by category"
    >
      {data.map((item) => {
        const width = max > 0 ? (item.total / max) * 100 : 0;
        const label = `${item.name}: ${formatCurrency(item.total)}, ${item.percentage}% of spending, ${item.count} ${item.count === 1 ? 'expense' : 'expenses'}`;
        return (
          <Tooltip
            key={item.categoryId}
            title={
              <>
                <strong>{item.name}</strong>
                <br />
                {formatCurrency(item.total)} · {item.percentage}% · {item.count}{' '}
                {item.count === 1 ? 'expense' : 'expenses'}
              </>
            }
            placement="top"
            followCursor
          >
            {/* The whole row is the hover and focus target, larger than the bar itself */}
            <Box
              component="li"
              tabIndex={0}
              aria-label={label}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '112px 1fr', sm: '140px 1fr' },
                alignItems: 'center',
                gap: 1.5,
                borderRadius: 1,
                outline: 'none',
                '&:hover .bar, &:focus-visible .bar': { filter: 'brightness(1.15)' },
                '&:focus-visible': { boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}` },
              }}
            >
              <Typography variant="body2" color="text.secondary" noWrap title={item.name}>
                {item.name}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', minWidth: 0 }}>
                <Box
                  className="bar"
                  sx={{
                    height: BAR_THICKNESS,
                    width: `${width}%`,
                    minWidth: item.total > 0 ? 4 : 0,
                    bgcolor: 'primary.main',
                    // Square at the baseline, rounded at the data end
                    borderRadius: '0 4px 4px 0',
                    transition: 'width 300ms ease, filter 150ms',
                    flexShrink: 1,
                  }}
                />
                <Typography variant="body2" sx={{ fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {formatCurrency(item.total)}
                </Typography>
              </Stack>
            </Box>
          </Tooltip>
        );
      })}
    </Stack>
  );
}

function DataTable({ data }: { data: CategorySpending[] }) {
  return (
    <Table size="small" aria-label="Spending by category">
      <TableHead>
        <TableRow>
          <TableCell>Category</TableCell>
          <TableCell align="right">Expenses</TableCell>
          <TableCell align="right">Share</TableCell>
          <TableCell align="right">Total</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.categoryId}>
            <TableCell>{item.name}</TableCell>
            <TableCell align="right">{item.count}</TableCell>
            <TableCell align="right">{item.percentage}%</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>
              {formatCurrency(item.total)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const withPercentages = (data: CategoryBar[]): CategorySpending[] => {
  const sum = data.reduce((total, item) => total + item.total, 0);
  return data.map((item) => ({
    ...item,
    percentage: item.percentage ?? (sum > 0 ? Math.round((item.total / sum) * 1000) / 10 : 0),
  }));
};

export default function CategorySpendingChart({
  data: rawData,
  loading,
  title = 'Spending by category',
  emptyMessage = 'No spending recorded this month.',
}: CategorySpendingChartProps) {
  const [view, setView] = useState<View>('chart');
  const data = withPercentages(rawData);

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={view}
            onChange={(_, next: View | null) => next && setView(next)}
            aria-label="Choose view"
          >
            <ToggleButton value="chart" aria-label="Chart view">
              <BarChartOutlined fontSize="small" />
            </ToggleButton>
            <ToggleButton value="table" aria-label="Table view">
              <TableRowsOutlined fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        {loading ? (
          <Stack spacing={1.5}>
            {[90, 70, 50, 35].map((width) => (
              <Skeleton key={width} variant="rounded" height={BAR_THICKNESS} width={`${width}%`} />
            ))}
          </Stack>
        ) : data.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
            {emptyMessage}
          </Typography>
        ) : view === 'chart' ? (
          <BarChart data={data} />
        ) : (
          <DataTable data={data} />
        )}
      </CardContent>
    </Card>
  );
}
