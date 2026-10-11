import { Box, Button, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router';

export default function NotFoundPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 2,
        textAlign: 'center',
      }}
    >
      <Typography variant="h2" component="h1" color="primary">
        404
      </Typography>
      <Typography color="text.secondary">The page you are looking for does not exist.</Typography>
      <Button variant="contained" component={RouterLink} to="/">
        Back to home
      </Button>
    </Box>
  );
}
