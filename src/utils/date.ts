const pad = (value: number): string => String(value).padStart(2, '0');

// Local calendar date, so "today" matches the user's clock rather than UTC
export const todayIso = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};
