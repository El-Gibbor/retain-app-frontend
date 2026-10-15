import type { PaymentMethod } from '../types/expense';

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

export const formatCurrency = (amount: number): string => currencyFormatter.format(amount);

// Dates arrive as YYYY-MM-DD; formatting in UTC stops them shifting a day in other time zones
export const formatDate = (value: string): string => dateFormatter.format(new Date(`${value}T00:00:00Z`));

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CASH: 'Cash',
  CARD: 'Card',
  BANK_TRANSFER: 'Bank transfer',
  MOBILE_MONEY: 'Mobile money',
  OTHER: 'Other',
};
