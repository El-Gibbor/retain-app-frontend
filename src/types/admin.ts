import type { User } from './auth';
import type { Expense } from './expense';

export interface CategoryUsage {
  categoryId: string;
  name: string;
  total: number;
  count: number;
}

export interface AdminExpense extends Expense {
  user: Pick<User, 'id' | 'name' | 'email'>;
}

export interface AdminInsights {
  totalUsers: number;
  totalExpenses: number;
  totalExpenseValue: number;
  expensesThisMonth: number;
  spendingByCategory: CategoryUsage[];
  topCategories: CategoryUsage[];
  bottomCategories: CategoryUsage[];
  recentExpenses: AdminExpense[];
  recentUsers: User[];
}
