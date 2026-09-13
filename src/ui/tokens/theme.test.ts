// @vitest-environment node
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname } from 'node:path';

import { compile } from 'tailwindcss';
import { beforeAll, describe, expect, it } from 'vitest';

// theme.css 를 Tailwind 로 직접 컴파일해 어떤 클래스가 CSS 를 만들고 어떤 클래스가 못 만드는지 확인한다.
const require = createRequire(import.meta.url);
let build: (candidates: string[]) => string;

beforeAll(async () => {
  const themePath = new URL('./theme.css', import.meta.url);
  const compiler = await compile(
    `@import 'tailwindcss/theme.css';\n@import 'tailwindcss/utilities.css';\n${await readFile(themePath, 'utf8')}`,
    {
      base: dirname(themePath.pathname),
      loadStylesheet: async (id) => {
        const path = require.resolve(id);
        return { path, base: dirname(path), content: await readFile(path, 'utf8') };
      },
    },
  );
  build = (candidates) => compiler.build(candidates);
});

describe('design tokens', () => {
  it.each([
    ['bg-primary-500', '--color-primary-500: #237f94'],
    ['text-primary', '--text-color-primary: var(--color-neutral-900)'],
    ['border-default', '--border-color-default: var(--color-primary-200)'],
    ['bg-status-error-background', '--color-status-error-background: #f9e0dc'],
    ['outline-focus', '--outline-color-focus: var(--border-color-focus)'],
    ['p-16', '--spacing-16: 1rem'],
    ['p-4', '--spacing-4: 0.25rem'],
    ['rounded-12', '--radius-12: 12px'],
    ['text-ui-14', '--text-ui-14--line-height: 1.375rem'],
    ['font-display', "--font-display: 'DONGGUK UNIVERSITY'"],
  ])('%s generates CSS from the Figma token', (candidate, declaration) => {
    const css = build([candidate]);
    expect(css).toContain(`.${candidate}`);
    expect(css).toContain(declaration);
  });

  it.each([
    'bg-red-500',
    'bg-white',
    'text-black',
    'p-2',
    'p-1.5',
    'mt-13',
    'rounded-lg',
    'text-sm',
  ])('%s outside the tokens generates nothing', (candidate) => {
    expect(build([candidate])).not.toContain(`.${candidate.replace('.', '\\.')}`);
  });
});
