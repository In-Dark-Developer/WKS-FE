import { render, screen, within } from '@testing-library/react';
import { expect, test } from 'vitest';

import { AppShell } from './AppShell';

test('네이티브 main 속성과 자식 콘텐츠를 함께 렌더한다', () => {
  render(
    <AppShell aria-labelledby="page-title" data-state="ready">
      <h1 id="page-title">오늘의 운세</h1>
      <p>내용이 길어져도 이어지는 풀이</p>
    </AppShell>,
  );

  const shell = screen.getByRole('main', { name: '오늘의 운세' });

  expect(shell).toHaveAttribute('data-state', 'ready');
  expect(within(shell).getByRole('heading', { name: '오늘의 운세' })).toBeInTheDocument();
  expect(within(shell).getByText('내용이 길어져도 이어지는 풀이')).toBeInTheDocument();
});
