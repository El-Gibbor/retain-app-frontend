const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (value: string): boolean => EMAIL_PATTERN.test(value.trim());

export const MIN_PASSWORD_LENGTH = 8;

const AMOUNT_PATTERN = /^\d+(\.\d{1,2})?$/;

// Returns an error message, or null when the amount is a positive value with at most 2 decimals
export const validateAmount = (value: string): string | null => {
  const amount = value.trim();
  if (!amount) return 'Amount is required';
  if (!AMOUNT_PATTERN.test(amount)) return 'Use a number with up to 2 decimal places';
  if (Number(amount) <= 0) return 'Amount must be greater than 0';
  return null;
};
