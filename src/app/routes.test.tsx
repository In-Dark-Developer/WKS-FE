import { cleanup, fireEvent, render, screen } from '@testing-library/react';
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
  // 친구 궁합 순위(05/T2 FriendRanking)가 ranking 슬롯에 조립돼 있다 — 인연이 없을 때 안내.
  expect(screen.getByText('아직 인연이 없어요')).toBeInTheDocument();
});

test('궁합 목록이 있으면 친구 궁합 순위에 보인다', async () => {
  writeSession('token-1');
  getResultMock.mockResolvedValue({
    ok: true,
    data: {
      ...stubResult,
      compatibilities: [
        { nickname: '친구1', score: 92, tier: 'GUIIN', createdAt: '2026-09-13T00:00:00Z' },
      ],
    },
  });

  renderAt('/reading/abc');

  expect(await screen.findByText('친구1')).toBeInTheDocument();
  expect(screen.getByText('92')).toBeInTheDocument();
});

// 04/T6 조립 — 결과 화면 share 슬롯과 인연카드 화면(`/reading/:id/card`).

test('share 슬롯에 인연카드 입구와 친구에게 공유가 채워져 있다', async () => {
  writeSession('token-1');
  getResultMock.mockResolvedValue({ ok: true, data: stubResult });

  renderAt('/reading/abc');

  expect(await screen.findByRole('button', { name: '인연카드 보기' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '친구에게 공유' })).toBeInTheDocument();
});

test('인연카드 보기를 누르면 카드 화면으로 가고, 돌아가기로 결과 화면에 돌아온다', async () => {
  writeSession('token-1');
  getResultMock.mockResolvedValue({ ok: true, data: stubResult });

  const router = renderAt('/reading/abc');
  fireEvent.click(await screen.findByRole('button', { name: '인연카드 보기' }));

  expect(
    await screen.findByRole('heading', { level: 1, name: '달빛토끼님의 인연카드' }),
  ).toBeInTheDocument();
  expect(router.state.location.pathname).toBe('/reading/abc/card');
  // 카드 화면은 결과 화면 아래에 덧붙는 것이 아니라 대신 뜬다(형제 라우트).
  expect(screen.queryByRole('heading', { name: '달빛토끼님의 사주 결과' })).not.toBeInTheDocument();
  expect(screen.getByRole('main')).toHaveAttribute('data-backdrop', 'result');

  fireEvent.click(screen.getByRole('link', { name: '결과로 돌아가기' }));

  expect(
    await screen.findByRole('heading', { name: '달빛토끼님의 사주 결과' }),
  ).toBeInTheDocument();
  expect(router.state.location.pathname).toBe('/reading/abc');
});

test('세션 없이 인연카드 화면에 들어오면 입력 화면으로 보낸다', async () => {
  const router = renderAt('/reading/abc/card');

  expect(
    await screen.findByRole('heading', { name: '운명도 꿰어야 사랑이다' }),
  ).toBeInTheDocument();
  expect(router.state.location.pathname).toBe('/');
});

test('인연카드 화면의 등급은 결혼·자녀·연애 순으로 카드에 실린다', async () => {
  writeSession('token-1');
  getResultMock.mockResolvedValue({ ok: true, data: stubResult });

  renderAt('/reading/abc/card');

  expect(
    await screen.findByRole('heading', { level: 1, name: '달빛토끼님의 인연카드' }),
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '카드 뒤집기' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '인스타 스토리 공유하기' })).toBeInTheDocument();
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
