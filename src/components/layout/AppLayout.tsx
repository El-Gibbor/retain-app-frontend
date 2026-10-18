import { Menu as MenuIcon } from '@mui/icons-material';
import { AppBar, Box, Drawer, IconButton, Link, Toolbar } from '@mui/material';
import { Suspense, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import ErrorBoundary from '../common/ErrorBoundary';
import PageLoader from '../common/PageLoader';
import Logo from '../common/Logo';
import NavList from './NavList';
import UserMenu from './UserMenu';

const DRAWER_WIDTH = 248;

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  const drawerContent = (onNavigate?: () => void) => (
    <>
      <Toolbar sx={{ px: 2.5 }}>
        <Logo />
      </Toolbar>
      <NavList onNavigate={onNavigate} />
    </>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Link
        href="#main-content"
        sx={{
          position: 'absolute',
          left: 16,
          top: -48,
          zIndex: (theme) => theme.zIndex.appBar + 1,
          bgcolor: 'background.paper',
          px: 2,
          py: 1,
          borderRadius: 1,
          boxShadow: 2,
          '&:focus': { top: 12 },
        }}
      >
        Skip to content
      </Link>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
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
            <Logo />
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
        <Box
          id="main-content"
          tabIndex={-1}
          sx={{ p: { xs: 2, sm: 3, lg: 4 }, maxWidth: 1400, mx: 'auto', outline: 'none' }}
        >
          {/* Keyed by path so an error on one page clears after navigating away */}
          <ErrorBoundary key={pathname}>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </Box>
      </Box>
    </Box>
  );
}
