import { render, screen, within } from '@testing-library/react';
import { expect, test } from 'vitest';

import { App } from '@/app/App';

test('루트 경로 콘텐츠를 앱 셸 안에 렌더한다', () => {
  render(<App />);

  const shell = screen.getByRole('main');

  expect(within(shell).getByRole('heading', { name: '운꿰사' })).toBeInTheDocument();
});
