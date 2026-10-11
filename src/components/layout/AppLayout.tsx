import { Menu as MenuIcon } from '@mui/icons-material';
import { AppBar, Box, Drawer, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import { useState } from 'react';
import { Outlet } from 'react-router';
import NavList from './NavList';
import UserMenu from './UserMenu';

const DRAWER_WIDTH = 248;

function Brand() {
  return (
    <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
      <Box component="img" src="/favicon.svg" alt="" sx={{ width: 32, height: 32 }} />
      <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
        Retain
      </Typography>
    </Stack>
  );
}

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const drawerContent = (onNavigate?: () => void) => (
    <>
      <Toolbar sx={{ px: 2.5 }}>
        <Brand />
      </Toolbar>
      <NavList onNavigate={onNavigate} />
    </>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <IconButton
            edge="start"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: { md: 'none' } }}>
            <Brand />
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <UserMenu />
        </Toolbar>
      </AppBar>

      <Box component="aside" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
          }}
        >
          {drawerContent(() => setMobileOpen(false))}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
          }}
        >
          {drawerContent()}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{ flexGrow: 1, minWidth: 0, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` } }}
      >
        <Toolbar />
        <Box sx={{ p: { xs: 2, sm: 3, lg: 4 }, maxWidth: 1400, mx: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
