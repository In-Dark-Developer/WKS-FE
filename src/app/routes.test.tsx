import { cleanup, render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';

import type { Result } from '@/api/schema/result';
import { writeSession } from '@/api/session';
import { routes } from '@/app/routes';

// getResult 는 src/api/ 경계 — 라우트 조립만 확인하니 실제 요청을 보내지 않는다 (CONVENTIONS 8장).
const { getResultMock } = vi.hoisted(() => ({ getResultMock: vi.fn() }));
vi.mock('@/api/results', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/results')>();
  return { ...actual, getResult: getResultMock };
});

const stubResult: Result = {
  resultId: 'abc',
  shareId: '11111111-1111-4111-8111-111111111111',
  nickname: '달빛토끼',
  zodiac: 'PIG',
  destiny: { title: '꽃길만 걷는 인연', description: '설명' },
  fortunes: [
    { category: 'MARRIAGE', grade: 'SS', content: '내용' },
    { category: 'CHILDREN', grade: 'A+', content: '내용' },
    { category: 'LOVE', grade: 'B', content: '내용' },
  ],
  luckyPlace: '만해광장',
  luckyItem: '작은 책 한 권',
  compatibilities: [],
};

afterEach(() => {
  cleanup();
  localStorage.clear();
  getResultMock.mockReset();
});

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(<RouterProvider router={router} />);
  return router;
}

test('루트 경로가 화면을 렌더한다', async () => {
  renderAt('/');

  expect(
    await screen.findByRole('heading', { name: '운명도 꿰어야 사랑이다' }),
  ).toBeInTheDocument();
});

test('세션 없이 결과 화면에 들어오면 입력 화면으로 보낸다', async () => {
  const router = renderAt('/reading/abc');

  expect(
    await screen.findByRole('heading', { name: '운명도 꿰어야 사랑이다' }),
  ).toBeInTheDocument();
  expect(router.state.location.pathname).toBe('/');
});

test('세션이 있으면 결과 화면에 머문다', async () => {
  writeSession('token-1');
  getResultMock.mockResolvedValue({ ok: true, data: stubResult });

  const router = renderAt('/reading/abc');

  expect(
    await screen.findByRole('heading', { name: '달빛토끼님의 사주 결과' }),
  ).toBeInTheDocument();
  expect(router.state.location.pathname).toBe('/reading/abc');
  expect(screen.getByRole('main')).toHaveAttribute('data-backdrop', 'result');
});

test('결과 조회가 실패하면 오류 화면을 보인다', async () => {
  writeSession('token-1');
  getResultMock.mockResolvedValue({
    ok: false,
    error: { kind: 'api', code: 'RESULT_NOT_FOUND', message: '없음' },
  });

  renderAt('/reading/abc');

  expect(await screen.findByRole('alert')).toHaveTextContent('찾는 점지가 없어요');
});

test('없는 경로는 오류 화면과 처음으로 가는 링크를 보인다', async () => {
  renderAt('/nowhere');

  expect(await screen.findByRole('alert')).toHaveTextContent('찾는 점지가 없어요');
  expect(screen.getByRole('main')).toHaveAttribute('data-backdrop', 'dawn');
  expect(screen.getByRole('link', { name: '처음으로 돌아가기' })).toHaveAttribute('href', '/');
});
