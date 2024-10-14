import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'), // Adjust the path to match your project structure
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: '__tests__/setupTests.ts',
  },
});
