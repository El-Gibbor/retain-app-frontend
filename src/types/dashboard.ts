import type { BudgetSummary } from './budget';
import type { Expense } from './expense';

export interface CategorySpending {
  categoryId: string;
  name: string;
  total: number;
  count: number;
  percentage: number;
}

export interface DashboardSummary {
  month: string;
  budget: BudgetSummary;
  expenseCount: number;
  highestExpense: Expense | null;
  spendingByCategory: CategorySpending[];
  recentExpenses: Expense[];
}
