import type { BudgetStatus } from '../types/budget';

interface BudgetStatusMeta {
  label: string;
  color: 'success' | 'warning' | 'error' | 'primary';
  description: string;
}

export const BUDGET_STATUS: Record<BudgetStatus, BudgetStatusMeta> = {
  unset: {
    label: 'No budget set',
    color: 'primary',
    description: 'Set a monthly limit to track how much you have left.',
  },
  within: {
    label: 'Within budget',
    color: 'success',
    description: 'You are comfortably within your limit.',
  },
  approaching: {
    label: 'Approaching limit',
    color: 'warning',
    description: 'You have used at least 80% of your budget.',
  },
  over: {
    label: 'Over budget',
    color: 'error',
    description: 'Spending has passed your limit for this month.',
  },
};
