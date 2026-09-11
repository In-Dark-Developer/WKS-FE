import { defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config';

// setupFiles(tests/setup.ts)은 Phase 01 T4가 스켈레톤과 함께 넣는다.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      include: ['src/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}'],
    },
  }),
);
