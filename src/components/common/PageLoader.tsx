import { Box, LinearProgress } from '@mui/material';

// Shown while a lazily loaded page downloads
export default function PageLoader() {
  return (
    <Box sx={{ py: 6 }} role="status" aria-label="Loading page">
      <LinearProgress sx={{ maxWidth: 240, mx: 'auto', borderRadius: 2 }} />
    </Box>
  );
}
