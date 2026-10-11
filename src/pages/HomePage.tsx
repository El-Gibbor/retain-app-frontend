import { Box, Button, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export default function HomePage() {
  const { user, isAdmin, signOut } = useAuth();

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Hello, {user?.name}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Signed in as {user?.email} ({user?.role.toLowerCase()})
      </Typography>
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        {isAdmin && (
          <Button variant="outlined" component={RouterLink} to="/admin">
            Admin dashboard
          </Button>
        )}
        <Button variant="contained" onClick={signOut}>
          Sign out
        </Button>
      </Box>
    </Box>
  );
}
