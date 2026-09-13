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

// hex(#abc·#aabbcc·#aabbccdd) · CSS 색 함수 · Tailwind 타입 힌트 [color:…]
const ARBITRARY_COLOR =
  '/#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})(?![0-9a-zA-Z_-])|\\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color-mix)\\(|\\[color:/';

export default tseslint.config(
  { ignores: ['dist/', 'coverage/', '.vite/'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
  {
    // 색은 src/ui/tokens/theme.css 의 토큰 클래스로만 쓴다 (CONVENTIONS 4장). hex·색 함수가 든 문자열을 막는다 —
    // bg-[#abc]·text-[rgb(0,0,0)]·style={{ color: '#fff' }}. 토큰 밖 팔레트 클래스(bg-red-500)는 theme.css 가 CSS 를 만들지 않는다.
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['**/*.test.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        ...['Literal[value', 'TemplateElement[value.raw'].map((attribute) => ({
          selector: `${attribute}=${ARBITRARY_COLOR}]`,
          message:
            '임의 색상 금지 — src/ui/tokens/theme.css 의 토큰 클래스를 쓴다 (CONVENTIONS 4장)',
        })),
      ],
    },
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
