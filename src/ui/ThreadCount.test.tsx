import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';

import { ThreadCount } from './ThreadCount';

afterEach(cleanup);

test('받은 잔액을 그대로 보인다', () => {
  render(<ThreadCount count={10} />);

  expect(screen.getByLabelText('운명의 실 보유 10개')).toHaveTextContent('보유10개');
});

test('잔액이 0 이어도 숨기지 않는다', () => {
  render(<ThreadCount count={0} />);

  expect(screen.getByLabelText('운명의 실 보유 0개')).toBeInTheDocument();
});
