import { Box, Chip, LinearProgress, Stack, Typography } from '@mui/material';
import type { BudgetSummary } from '../../types/budget';
import { BUDGET_STATUS } from '../../utils/budget';
import { formatCurrency } from '../../utils/format';

interface BudgetProgressProps {
  summary: BudgetSummary;
}

function Figure({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h6" component="p" sx={{ color, overflowWrap: 'anywhere' }}>
        {value}
      </Typography>
    </Box>
  );
}

export default function BudgetProgress({ summary }: BudgetProgressProps) {
  const meta = BUDGET_STATUS[summary.status];
  const percent = summary.percentUsed ?? 0;
  const over = summary.remaining !== null && summary.remaining < 0;

  return (
    <Stack spacing={2.5}>
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: 1 }}
      >
        <Chip label={meta.label} color={meta.color} size="small" />
        {summary.percentUsed !== null && (
          <Typography variant="body2" color="text.secondary">
            {summary.percentUsed}% used
          </Typography>
        )}
      </Stack>

      {summary.budget !== null && (
        <LinearProgress
          variant="determinate"
          value={Math.min(percent, 100)}
          color={meta.color}
          aria-label={`${summary.percentUsed}% of budget used`}
          sx={{ height: 10, borderRadius: 5 }}
        />
      )}

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(3, minmax(0, 1fr))' },
        }}
      >
        <Figure label="Spent" value={formatCurrency(summary.spent)} />
        <Figure label="Budget" value={summary.budget === null ? '—' : formatCurrency(summary.budget)} />
        <Figure
          label={over ? 'Over by' : 'Remaining'}
          value={summary.remaining === null ? '—' : formatCurrency(Math.abs(summary.remaining))}
          color={over ? 'error.main' : undefined}
        />
      </Box>

      <Typography variant="body2" color="text.secondary">
        {meta.description}
      </Typography>
    </Stack>
  );
}
