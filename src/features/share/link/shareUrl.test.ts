import { expect, test } from 'vitest';

import { buildShareUrl } from './shareUrl';

test('지금 열려 있는 origin 으로 /s/<shareId> 를 만든다', () => {
  expect(buildShareUrl('9f0d3f1e-0000-4000-8000-000000000001')).toBe(
    `${window.location.origin}/s/9f0d3f1e-0000-4000-8000-000000000001`,
  );
});

test('절대 주소를 박아 넣지 않는다 — origin 이 바뀌면 링크도 바뀐다', () => {
  expect(buildShareUrl('abc').startsWith(window.location.origin)).toBe(true);
  expect(buildShareUrl('abc')).not.toContain('threatoffate');
});

test('경로에 쓸 수 없는 문자는 인코딩한다', () => {
  expect(buildShareUrl('a/b?c')).toBe(`${window.location.origin}/s/a%2Fb%3Fc`);
});
