import { fileURLToPath } from 'node:url';

import { mergeConfig } from 'vite';
import { configDefaults, defineConfig } from 'vitest/config';

import viteConfig from './vite.config';

export default defineConfig(async () => {
  const viteConfigResolved = viteConfig({
    mode: 'test',
    command: 'build',
  });

  return mergeConfig(viteConfigResolved, {
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      setupFiles: ['./vitest.setup.ts'],
    },
  });
});
