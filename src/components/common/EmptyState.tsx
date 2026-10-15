import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Box sx={{ py: 8, px: 2, textAlign: 'center', color: 'text.secondary' }}>
      <Box sx={{ fontSize: 48, color: 'primary.main', mb: 1, '& svg': { fontSize: 'inherit' } }}>{icon}</Box>
      <Typography variant="h6" component="p" color="text.primary">
        {title}
      </Typography>
      {description && <Typography sx={{ mt: 0.5, mb: action ? 2.5 : 0 }}>{description}</Typography>}
      {action}
    </Box>
  );
}
