import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';

const { rerollMock } = vi.hoisted(() => ({ rerollMock: vi.fn() }));
vi.mock('@/api/dating', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/dating')>();
  return { ...actual, rerollRecommendations: rerollMock };
});

import type { DatingCardsView, MatchCandidateView } from './cardsView';
import { DatingCardsScreen, REROLL_FAILED_MESSAGE } from './DatingCardsScreen';

const candidate: MatchCandidateView = {
  id: 'c1',
  rank: 1,
  score: 98,
  mbti: 'ENTP',
  bio: '영화 보러 다니는 걸 좋아해요.',
  photo: { isLocked: true, thumbnailUrl: null, cost: 10 },
  name: { isLocked: true, cost: 7 },
  department: { isLocked: true, cost: 5 },
  reason: { isLocked: true, cost: 3 },
};

function renderScreen(view: DatingCardsView) {
  const router = createMemoryRouter(
    [{ path: '/dating/cards', element: <DatingCardsScreen view={view} /> }],
    { initialEntries: ['/dating/cards'] },
  );
  render(<RouterProvider router={router} />);
}

function openRerollSheet() {
  fireEvent.click(screen.getByRole('button', { name: '다른 인연 만나보기' }));
}

afterEach(() => {
  cleanup();
  rerollMock.mockReset();
  vi.restoreAllMocks();
});

test('잔액이 모자라면 변경 버튼이 막히고 알린다 (FR-31)', async () => {
  renderScreen({
    balance: 2,
    candidates: [candidate],
    reroll: { kind: 'paid', cost: 3, canAfford: false },
  });

  openRerollSheet();
  const confirm = await screen.findByRole('button', { name: '3실로 지금 변경하기' });

  expect(confirm).toBeDisabled();
  expect(screen.getByRole('alert')).toHaveTextContent('운명의 실이 부족해요');
  fireEvent.click(confirm);
  expect(rerollMock).not.toHaveBeenCalled();
});

test('리롤이 실패하면 추천을 그대로 두고 알린다 (FR-27)', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  rerollMock.mockResolvedValue({ ok: false, error: { kind: 'network' } });
  renderScreen({ balance: 10, candidates: [candidate], reroll: { kind: 'free' } });

  openRerollSheet();
  fireEvent.click(await screen.findByRole('button', { name: '무료 점지권으로 변경하기' }));

  expect(await screen.findByRole('status')).toHaveTextContent(REROLL_FAILED_MESSAGE);
  expect(screen.getByText('영화 보러 다니는 걸 좋아해요.')).toBeInTheDocument();
});

test('잔액과 빈 카드를 그린다 (FR-26)', () => {
  renderScreen({ balance: 7, candidates: [], reroll: { kind: 'free' } });

  expect(screen.getByLabelText('운명의 실 보유 7개')).toBeInTheDocument();
  expect(screen.getByText('운명의 인연을 기다리고 있어요')).toBeInTheDocument();
});
