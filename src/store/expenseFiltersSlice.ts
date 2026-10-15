import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ExpenseQuery, PaymentMethod, SortBy, SortOrder } from '../types/expense';
import type { RootState } from './index';

export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

export interface ExpenseFiltersState {
  search: string;
  categoryIds: string[];
  paymentMethods: PaymentMethod[];
  /** YYYY-MM-DD */
  from: string | null;
  /** YYYY-MM-DD */
  to: string | null;
  minAmount: number | null;
  maxAmount: number | null;
  sortBy: SortBy;
  sortOrder: SortOrder;
  page: number;
  limit: number;
  /** Bumped on every clear so text inputs holding local drafts can resync */
  resetCount: number;
}

export const initialExpenseFilters: ExpenseFiltersState = {
  search: '',
  categoryIds: [],
  paymentMethods: [],
  from: null,
  to: null,
  minAmount: null,
  maxAmount: null,
  sortBy: 'date',
  sortOrder: 'desc',
  page: 1,
  limit: PAGE_SIZE_OPTIONS[0],
  resetCount: 0,
};

interface Range<T> {
  min: T | null;
  max: T | null;
}

const expenseFiltersSlice = createSlice({
  name: 'expenseFilters',
  initialState: initialExpenseFilters,
  // Every filter change returns to page 1 so results never start on an empty page
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 1;
    },
    setCategoryIds(state, action: PayloadAction<string[]>) {
      state.categoryIds = action.payload;
      state.page = 1;
    },
    setPaymentMethods(state, action: PayloadAction<PaymentMethod[]>) {
      state.paymentMethods = action.payload;
      state.page = 1;
    },
    setDateRange(state, action: PayloadAction<Range<string>>) {
      state.from = action.payload.min;
      state.to = action.payload.max;
      state.page = 1;
    },
    setAmountRange(state, action: PayloadAction<Range<number>>) {
      state.minAmount = action.payload.min;
      state.maxAmount = action.payload.max;
      state.page = 1;
    },
    setSort(state, action: PayloadAction<{ sortBy: SortBy; sortOrder: SortOrder }>) {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = Math.max(1, action.payload);
    },
    setLimit(state, action: PayloadAction<number>) {
      state.limit = action.payload;
      state.page = 1;
    },
    resetExpenseFilters(state) {
      return { ...initialExpenseFilters, resetCount: state.resetCount + 1 };
    },
    clearFilters(state) {
      // Sorting and page size are preferences, not filters, so they survive a clear
      return {
        ...initialExpenseFilters,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
        limit: state.limit,
        resetCount: state.resetCount + 1,
      };
    },
  },
});

export const {
  setSearch,
  setCategoryIds,
  setPaymentMethods,
  setDateRange,
  setAmountRange,
  setSort,
  setPage,
  setLimit,
  clearFilters,
  resetExpenseFilters,
} = expenseFiltersSlice.actions;

export const expenseFiltersReducer = expenseFiltersSlice.reducer;

export const selectExpenseFilters = (state: RootState) => state.expenseFilters;

// Maps UI state to the API's query shape; memoised so effects only re-run on real changes
export const selectExpenseQuery = createSelector(
  [selectExpenseFilters],
  (filters): ExpenseQuery => ({
    search: filters.search.trim() || undefined,
    categoryId: filters.categoryIds.length ? filters.categoryIds : undefined,
    paymentMethod: filters.paymentMethods.length ? filters.paymentMethods : undefined,
    from: filters.from ?? undefined,
    to: filters.to ?? undefined,
    minAmount: filters.minAmount ?? undefined,
    maxAmount: filters.maxAmount ?? undefined,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    page: filters.page,
    limit: filters.limit,
  }),
);

export const selectActiveFilterCount = createSelector([selectExpenseFilters], (filters) =>
  [
    filters.search.trim() !== '',
    filters.categoryIds.length > 0,
    filters.paymentMethods.length > 0,
    filters.from !== null || filters.to !== null,
    filters.minAmount !== null || filters.maxAmount !== null,
  ].filter(Boolean).length,
);
