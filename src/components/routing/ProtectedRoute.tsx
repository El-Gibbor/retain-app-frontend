import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import FullPageLoader from './FullPageLoader';

export default function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <FullPageLoader />;
  if (status === 'unauthenticated') {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
