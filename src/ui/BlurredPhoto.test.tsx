import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';

import { BlurredPhoto } from './BlurredPhoto';

afterEach(cleanup);

test('받은 주소 하나만 그린다', () => {
  render(<BlurredPhoto alt="잠긴 사진" isBlurred src="/thumb.webp" />);

  expect(screen.getByRole('img', { name: '잠긴 사진' })).toHaveAttribute('src', '/thumb.webp');
  expect(screen.getAllByRole('img')).toHaveLength(1);
});
