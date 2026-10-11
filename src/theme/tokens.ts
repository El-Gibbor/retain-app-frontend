// Single source for brand colours; swap values here to restyle the whole app
export const civic = {
  blue: '#1D4ED8',
  green: '#16A34A',
  amber: '#F59E0B',
  dark: '#0F172A',
  muted: '#64748B',
  border: '#E5E7EB',
  surface: '#FFFFFF',
  bg: '#FFFFFF',
} as const;

export const civicShadow = '0 1px 12px rgba(0, 0, 0, 0.08)';

export type CivicPalette = typeof civic;
