import { Navigate, Outlet, useLocation, type Location } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import FullPageLoader from './FullPageLoader';

// Single redirect point after sign-in, so users land on the page they originally asked for
export default function GuestRoute() {
  const { status } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: Location } | null)?.from?.pathname ?? '/';

  if (status === 'loading') return <FullPageLoader />;
  if (status === 'authenticated') return <Navigate to={from} replace />;
  return <Outlet />;
}
