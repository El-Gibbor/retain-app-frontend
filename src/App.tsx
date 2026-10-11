import { Route, Routes } from 'react-router';
import AdminRoute from './components/routing/AdminRoute';
import GuestRoute from './components/routing/GuestRoute';
import ProtectedRoute from './components/routing/ProtectedRoute';
import AdminPage from './pages/AdminPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';

export default function App() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
