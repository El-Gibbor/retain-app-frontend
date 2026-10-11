import { Box, Typography } from '@mui/material';

export default function AdminPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin dashboard
      </Typography>
      <Typography color="text.secondary">Category management and platform insights.</Typography>
    </Box>
  );
}
