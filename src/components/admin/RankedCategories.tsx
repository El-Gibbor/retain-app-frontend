import { Box, Card, CardContent, List, ListItem, Skeleton, Typography } from '@mui/material';
import type { CategoryUsage } from '../../types/admin';
import { formatCurrency } from '../../utils/format';

interface RankedCategoriesProps {
  title: string;
  description: string;
  items: CategoryUsage[];
  loading: boolean;
}

export default function RankedCategories({ title, description, items, loading }: RankedCategoriesProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {description}
        </Typography>
        {loading ? (
          Array.from({ length: 5 }, (_, index) => <Skeleton key={index} height={40} />)
        ) : (
          <List disablePadding component="ol" aria-label={title}>
            {items.map((item, index) => (
              <ListItem key={item.categoryId} divider disableGutters sx={{ py: 1, gap: 1.5 }}>
                <Box
                  aria-hidden
                  sx={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 13,
                    fontWeight: 600,
                    bgcolor: 'action.selected',
                    color: 'primary.main',
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </Box>
                <Typography sx={{ flex: 1, minWidth: 0, fontWeight: 500 }} noWrap>
                  {item.name}
                </Typography>
                <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {item.count} {item.count === 1 ? 'use' : 'uses'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatCurrency(item.total)}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
