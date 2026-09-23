import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import type { DatingCardsView, MatchCandidateView } from './cardsView';
import { DatingCards } from './DatingCards';

afterEach(() => {
  cleanup();
  document.body.style.overflow = '';
});

function candidate(id: string, rank: number): MatchCandidateView {
  return {
    id,
    rank,
    score: 90 - rank,
    relationLabel: '천생연분',
    mbti: 'ENTP',
    bio: `${id} 자기소개`,
    photo: { isLocked: true, thumbnailUrl: `/${id}.webp`, cost: 10 },
    name: { isLocked: true, cost: 7 },
    department: { isLocked: true, cost: 5 },
    reason: { isLocked: true, cost: 3 },
  };
}

const view: DatingCardsView = {
  balance: 12,
  candidates: [candidate('c1', 1), candidate('c2', 2), candidate('c3', 3)],
  reroll: { kind: 'free' },
};

function renderCards(overrides: Partial<DatingCardsView> = {}) {
  const handlers = {
    onSendThread: vi.fn(),
    onOpenUnlock: vi.fn(),
    onReroll: vi.fn(),
    onOpenRequests: vi.fn(),
  };
  render(<DatingCards view={{ ...view, ...overrides }} {...handlers} />);
  return handlers;
}

test('상단에 실 잔액을 보이고 요청함을 연다', () => {
  const { onOpenRequests } = renderCards();

  expect(screen.getByLabelText('운명의 실 보유 12개')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '요청함' }));

  expect(onOpenRequests).toHaveBeenCalledTimes(1);
});

test('운명의 실 보내기는 지금 보고 있는 인연에게 간다', () => {
  const { onSendThread } = renderCards();

  fireEvent.click(screen.getByRole('button', { name: '운명의 실 보내기' }));
  fireEvent.click(screen.getByRole('button', { name: '2번째 인연 보기' }));
  fireEvent.click(screen.getByRole('button', { name: '운명의 실 보내기' }));

  expect(onSendThread.mock.calls).toEqual([['c1'], ['c2']]);
});

test('추천이 없으면 기다림 안내를 보이고 실을 보낼 수 없다', () => {
  renderCards({ candidates: [] });

  expect(screen.getByText('운명의 인연을 기다리고 있어요')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '운명의 실 보내기' })).toBeDisabled();
});

test('무료 리롤이 남았으면 무료 점지권으로 바꾸고, 고르면 onReroll 을 부른다', () => {
  const { onReroll } = renderCards();

  expect(screen.getByText('오늘 1회 무료 점지권이 생겼어요.')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '다른 인연 만나보기' }));
  fireEvent.click(screen.getByRole('button', { name: '무료 점지권으로 변경하기' }));

  expect(onReroll).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('유료 리롤은 비용을 보이고, 잔액이 모자라면 막는다', () => {
  const { onReroll } = renderCards({ reroll: { kind: 'paid', cost: 3, canAfford: false } });

  expect(screen.getByText('다음 무료 점지는 오늘 자정이에요.')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '다른 인연 만나보기' }));

  expect(screen.getByRole('alert')).toHaveTextContent('운명의 실이 부족해요');
  expect(screen.getByRole('button', { name: '3실로 지금 변경하기' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: '자정까지 기다릴게요' }));

  expect(onReroll).not.toHaveBeenCalled();
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
