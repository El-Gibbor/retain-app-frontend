const pad = (value: number): string => String(value).padStart(2, '0');

// Local calendar date, so "today" matches the user's clock rather than UTC
export const todayIso = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

/** YYYY-MM for the user's current local month */
export const currentMonth = (): string => todayIso().slice(0, 7);

export const shiftMonth = (month: string, delta: number): string => {
  const [year, monthIndex] = month.split('-').map(Number);
  const shifted = new Date(Date.UTC(year, monthIndex - 1 + delta, 1));
  return `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}`;
};

// First and last calendar day of a YYYY-MM month
export const monthBounds = (month: string): { from: string; to: string } => {
  const [year, monthIndex] = month.split('-').map(Number);
  const lastDay = new Date(Date.UTC(year, monthIndex, 0)).getUTCDate();
  return { from: `${month}-01`, to: `${month}-${pad(lastDay)}` };
};

export const isValidMonth = (value: string | null): value is string =>
  value !== null && /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
