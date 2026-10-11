import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { NavLink } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { NAV_ITEMS } from './navigation';

interface NavListProps {
  onNavigate?: () => void;
}

export default function NavList({ onNavigate }: NavListProps) {
  const { isAdmin } = useAuth();
  const items = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  return (
    <List component="nav" aria-label="Main navigation" sx={{ px: 1.5 }}>
      {items.map(({ label, path, icon: Icon }) => (
        <ListItemButton
          key={path}
          component={NavLink}
          to={path}
          end={path === '/'}
          onClick={onNavigate}
          sx={{
            borderRadius: 2,
            mb: 0.5,
            '&.active': {
              bgcolor: 'action.selected',
              color: 'primary.main',
              '& .MuiListItemIcon-root': { color: 'primary.main' },
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Icon />
          </ListItemIcon>
          <ListItemText primary={label} slotProps={{ primary: { sx: { fontWeight: 500 } } }} />
        </ListItemButton>
      ))}
    </List>
  );
}
