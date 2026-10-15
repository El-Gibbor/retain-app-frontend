import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Button, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { currentMonth, shiftMonth } from '../../utils/date';
import { formatMonth } from '../../utils/format';

interface MonthPickerProps {
  month: string;
  onChange: (month: string) => void;
}

export default function MonthPicker({ month, onChange }: MonthPickerProps) {
  const thisMonth = currentMonth();

  return (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
      <Tooltip title="Previous month">
        <IconButton aria-label="Previous month" onClick={() => onChange(shiftMonth(month, -1))}>
          <ChevronLeft />
        </IconButton>
      </Tooltip>
      <Typography
        component="p"
        aria-live="polite"
        sx={{ fontWeight: 600, minWidth: 140, textAlign: 'center' }}
      >
        {formatMonth(month)}
      </Typography>
      <Tooltip title="Next month">
        <IconButton aria-label="Next month" onClick={() => onChange(shiftMonth(month, 1))}>
          <ChevronRight />
        </IconButton>
      </Tooltip>
      {month !== thisMonth && (
        <Button size="small" onClick={() => onChange(thisMonth)}>
          This month
        </Button>
      )}
    </Stack>
  );
}
