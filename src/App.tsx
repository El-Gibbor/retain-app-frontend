import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import FullPageLoader from './components/routing/FullPageLoader';
import AppLayout from './components/layout/AppLayout';
import AdminRoute from './components/routing/AdminRoute';
import GuestRoute from './components/routing/GuestRoute';
import ProtectedRoute from './components/routing/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';

// Signed-in pages load on demand so the sign-in screen stays light
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ExpensesPage = lazy(() => import('./pages/ExpensesPage'));
const ExpenseDetailPage = lazy(() => import('./pages/ExpenseDetailPage'));
const BudgetPage = lazy(() => import('./pages/BudgetPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

export default function App() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/expenses/:id" element={<ExpenseDetailPage />} />
            <Route path="/budget" element={<BudgetPage />} />
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
