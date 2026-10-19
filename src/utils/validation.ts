const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (value: string): boolean => EMAIL_PATTERN.test(value.trim());

export const MIN_PASSWORD_LENGTH = 8;

const AMOUNT_PATTERN = /^\d+$/;

// Returns an error message, or null when the amount is a positive whole number of francs
export const validateAmount = (value: string): string | null => {
  const amount = value.trim();
  if (!amount) return 'Amount is required';
  if (!AMOUNT_PATTERN.test(amount)) return 'Use a whole number of francs';
  if (Number(amount) <= 0) return 'Amount must be greater than 0';
  return null;
};
