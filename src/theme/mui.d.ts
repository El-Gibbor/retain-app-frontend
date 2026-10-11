import type { CivicPalette } from './tokens';

declare module '@mui/material/styles' {
  interface Palette {
    civic: CivicPalette;
  }
  interface PaletteOptions {
    civic?: CivicPalette;
  }
}
