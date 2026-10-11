export const PAYMENT_METHODS = ['CASH', 'CARD', 'BANK_TRANSFER', 'MOBILE_MONEY', 'OTHER'] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export interface Expense {
  id: string;
  title: string;
  amount: number;
  /** YYYY-MM-DD */
  date: string;
  paymentMethod: PaymentMethod;
  notes: string | null;
  category: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ExpensePayload {
  title: string;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  categoryId?: string;
  notes?: string | null;
}

export type SortBy = 'date' | 'amount';
export type SortOrder = 'asc' | 'desc';

export interface ExpenseQuery {
  search?: string;
  categoryId?: string[];
  paymentMethod?: PaymentMethod[];
  from?: string;
  to?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
}

export interface Paginated<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
