import { Card, CardContent, Skeleton, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface StatTileProps {
  label: string;
  value: ReactNode;
  /** The one figure the dashboard leads with */
  hero?: boolean;
  loading?: boolean;
  children?: ReactNode;
}

export default function StatTile({ label, value, hero = false, loading = false, children }: StatTileProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        {loading ? (
          <Skeleton width="60%" height={hero ? 60 : 40} />
        ) : (
          <Typography
            component="p"
            sx={{
              fontWeight: 600,
              fontSize: hero ? { xs: 36, sm: 48 } : 24,
              lineHeight: 1.2,
              mt: 0.5,
              overflowWrap: 'anywhere',
            }}
          >
            {value}
          </Typography>
        )}
        {!loading && children}
      </CardContent>
    </Card>
  );
}
