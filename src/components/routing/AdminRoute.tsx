import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../../hooks/useAuth';

// Nested inside ProtectedRoute, so the user is already signed in here
export default function AdminRoute() {
  const { isAdmin } = useAuth();
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}
