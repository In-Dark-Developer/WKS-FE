import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

// 의존 방향은 docs/ARCHITECTURE.md 의 Dependency Direction 을 그대로 옮긴 것이다:
// app → features → { ui, api, lib } · ui → lib · api → lib
const boundary = (files, groups, message) => ({
  files,
  rules: {
    'no-restricted-imports': ['error', { patterns: [{ group: groups, message }] }],
  },
});

export default tseslint.config(
  { ignores: ['dist/', 'coverage/', '.vite/'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
  boundary(
    ['src/ui/**'],
    ['@/features/*', '@/api/*', '@/app/*'],
    'ui 는 lib 만 의존한다 — 값은 props 로 받는다 (ARCHITECTURE Dependency Direction)',
  ),
  boundary(
    ['src/api/**'],
    ['@/features/*', '@/ui/*', '@/app/*'],
    'api 는 lib 만 의존한다 (ARCHITECTURE Dependency Direction)',
  ),
  boundary(
    ['src/lib/**'],
    ['@/app/*', '@/features/*', '@/ui/*', '@/api/*'],
    'lib 은 도메인 비의존이다 — 다른 모듈을 import 하지 않는다',
  ),
  boundary(
    ['src/features/**'],
    ['@/app/*', '@/features/*'],
    'features 는 app 과 다른 feature 를 import 하지 않는다 — 같은 feature 안은 상대 경로로 (ARCHITECTURE Module Boundaries)',
  ),
);
