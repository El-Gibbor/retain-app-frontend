import type { PaymentMethod } from '../types/expense';

const currencyFormatter = new Intl.NumberFormat('en-RW', {
  style: 'currency',
  currency: 'RWF',
  currencyDisplay: 'code',
});

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

const dateTimeFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export const formatDateTime = (value: string): string => dateTimeFormatter.format(new Date(value));

const monthFormatter = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });

export const formatMonth = (month: string): string => monthFormatter.format(new Date(`${month}-01T00:00:00Z`));
