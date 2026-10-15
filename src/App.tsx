import { Route, Routes } from 'react-router';
import AppLayout from './components/layout/AppLayout';
import AdminRoute from './components/routing/AdminRoute';
import GuestRoute from './components/routing/GuestRoute';
import ProtectedRoute from './components/routing/ProtectedRoute';
import AdminPage from './pages/AdminPage';
import BudgetPage from './pages/BudgetPage';
import DashboardPage from './pages/DashboardPage';
import ExpenseDetailPage from './pages/ExpenseDetailPage';
import ExpensesPage from './pages/ExpensesPage';
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
  );
}
