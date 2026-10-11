import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export default function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <Box
      component="main"
      sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', px: 2, py: 4 }}
    >
      <Stack spacing={3} sx={{ width: '100%', maxWidth: 420 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'center' }}>
          <Box component="img" src="/favicon.svg" alt="" sx={{ width: 40, height: 40 }} />
          <Typography variant="h5" component="span" sx={{ fontWeight: 700 }}>
            Retain
          </Typography>
        </Stack>
        <Card>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Typography variant="h5" component="h1" gutterBottom>
              {title}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {subtitle}
            </Typography>
            {children}
          </CardContent>
        </Card>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          {footer}
        </Typography>
      </Stack>
    </Box>
  );
}
