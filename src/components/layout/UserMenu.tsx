import { Logout } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState, type MouseEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';

const getInitials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

export default function UserMenu() {
  const { user, isAdmin, signOut } = useAuth();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  if (!user) return null;

  const close = () => setAnchor(null);

  return (
    <>
      <Tooltip title="Account">
        <IconButton
          onClick={(event: MouseEvent<HTMLElement>) => setAnchor(event.currentTarget)}
          aria-label="Open account menu"
          aria-controls={anchor ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={anchor ? 'true' : undefined}
          size="small"
        >
          <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 15 }}>
            {getInitials(user.name)}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        id="account-menu"
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { mt: 1, minWidth: 240 } } }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography sx={{ fontWeight: 600 }} noWrap>
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {user.email}
          </Typography>
          {isAdmin && <Chip label="Admin" size="small" color="secondary" sx={{ mt: 1 }} />}
        </Box>
        <Divider />
        <MenuItem
          onClick={() => {
            close();
            signOut();
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </Menu>
    </>
  );
}
