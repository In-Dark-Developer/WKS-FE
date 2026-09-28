import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';

import { Avatar } from './Avatar';

afterEach(cleanup);

test('사진이 있으면 이름을 대체 텍스트로 보인다', () => {
  render(<Avatar name="김채원" src="/photo.webp" />);

  expect(screen.getByRole('img', { name: '김채원' })).toHaveAttribute('src', '/photo.webp');
});

test('사진이 없으면 이름 첫 글자를 보인다', () => {
  render(<Avatar name="김채원" />);

  expect(screen.getByRole('img', { name: '김채원' })).toHaveTextContent('김');
});
