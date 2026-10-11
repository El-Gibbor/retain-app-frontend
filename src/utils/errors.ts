import { ApiError } from '../api/client';

export const getErrorMessage = (error: unknown, fallback = 'Something went wrong. Please try again.'): string =>
  error instanceof Error && error.message ? error.message : fallback;

// First server-side message for each field, keyed by field name
export const getFieldErrors = (error: unknown): Record<string, string> => {
  if (!(error instanceof ApiError) || !error.details) return {};
  return Object.fromEntries(
    Object.entries(error.details)
      .filter(([, messages]) => messages.length > 0)
      .map(([field, messages]) => [field, messages[0]]),
  );
};
