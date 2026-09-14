import { defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config.ts';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      // 파일마다 jsdom 을 새로 만드는 비용이 전체의 60% 였다 — vmThreads 는 워커당 한 번 만들고 파일마다 VM 컨텍스트로
      // 격리를 유지한다. 2 워커 기준 13.9s → 2.6s, 264 tests 동일 통과(2026-09-15). isolate:false 는 테스트끼리 상태가
      // 새어 13개가 깨져 쓰지 않는다.
      pool: 'vmThreads',
      setupFiles: ['./tests/setup.ts'],
      include: ['src/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}'],
    },
  }),
);
