import { cleanup, render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterEach, expect, test } from 'vitest';

import { writeSession } from '@/api/session';
import { routes } from '@/app/routes';

afterEach(() => {
  cleanup();
  localStorage.clear();
});

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(<RouterProvider router={router} />);
  return router;
}

test('루트 경로가 화면을 렌더한다', async () => {
  renderAt('/');

  expect(await screen.findByRole('heading', { name: '운꿰사' })).toBeInTheDocument();
});

test('세션 없이 결과 화면에 들어오면 입력 화면으로 보낸다', async () => {
  const router = renderAt('/reading/abc');

  expect(await screen.findByRole('heading', { name: '운꿰사' })).toBeInTheDocument();
  expect(router.state.location.pathname).toBe('/');
});

test('세션이 있으면 결과 화면에 머문다', async () => {
  writeSession('token-1');
  const router = renderAt('/reading/abc');

  expect(await screen.findByRole('heading', { name: '운꿰사' })).toBeInTheDocument();
  expect(router.state.location.pathname).toBe('/reading/abc');
  expect(screen.getByRole('main')).toHaveAttribute('data-backdrop', 'result');
});

test('없는 경로는 오류 화면과 처음으로 가는 링크를 보인다', async () => {
  renderAt('/nowhere');

  expect(await screen.findByRole('alert')).toHaveTextContent('찾는 점지가 없어요');
  expect(screen.getByRole('main')).toHaveAttribute('data-backdrop', 'dawn');
  expect(screen.getByRole('link', { name: '처음으로 돌아가기' })).toHaveAttribute('href', '/');
});
