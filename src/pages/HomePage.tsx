import { Box, Typography } from '@mui/material';

export default function HomePage() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Retain
      </Typography>
      <Typography color="text.secondary">Track expenses and stay within your monthly budget.</Typography>
    </Box>
  );
}
