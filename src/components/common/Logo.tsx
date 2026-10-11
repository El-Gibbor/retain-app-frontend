import { Box, Stack, Typography } from '@mui/material';

interface LogoProps {
  size?: number;
}

export default function Logo({ size = 32 }: LogoProps) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <Box component="img" src="/logo.png" alt="" sx={{ width: size, height: size }} />
      <Typography
        component="span"
        sx={{ fontWeight: 700, fontSize: size * 0.62, letterSpacing: '-0.01em', color: 'text.primary' }}
      >
        Retain
      </Typography>
    </Stack>
  );
}
