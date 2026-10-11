import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  // Fixed port keeps the dev origin in line with the API's CORS allow-list
  server: { port: 5173, strictPort: true },
});
