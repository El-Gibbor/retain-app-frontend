import { Box, CircularProgress } from '@mui/material';

export default function FullPageLoader() {
  return (
    <Box
      role="status"
      aria-label="Loading"
      sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}
    >
      <CircularProgress />
    </Box>
  );
}
