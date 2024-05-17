import { defineConfig } from 'vite';
import istanbul from 'vite-plugin-istanbul';

export default defineConfig({
  build: { sourcemap: true },
  plugins: [
    istanbul({
      include: ['**/*'],
      exclude: ['node_modules'],
      requireEnv: false,
    }),
  ],
});
