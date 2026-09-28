import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import type { CandidateRank, DatingCardsView, MatchCandidateView } from './cardsView';
import { DatingCards } from './DatingCards';

afterEach(() => {
  cleanup();
  document.body.style.overflow = '';
});

function candidate(id: string, rank: CandidateRank): MatchCandidateView {
  return {
    id,
    rank,
    score: 90 - rank,
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
  checkedInToday: true,
  candidates: [candidate('c1', 1), candidate('c2', 2), candidate('c3', 3)],
  reroll: { kind: 'free' },
};

function renderCards(overrides: Partial<DatingCardsView> = {}) {
  const handlers = {
    onSendThread: vi.fn(),
    onOpenUnlock: vi.fn(),
    onReroll: vi.fn(),
    onOpenReceived: vi.fn(),
    onOpenRequests: vi.fn(),
  };
  render(<DatingCards view={{ ...view, ...overrides }} {...handlers} />);
  return handlers;
}

test('상단에는 잔액을 두지 않고 요청함을 연다', () => {
  const { onOpenRequests } = renderCards();

  expect(screen.queryByText('12개')).not.toBeInTheDocument();
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

  expect(screen.getByRole('alert')).toHaveTextContent('운명의 실 3개가 필요해요');
  expect(screen.getByRole('button', { name: '실 3개로 지금 변경하기' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: '자정까지 기다릴게요' }));

  expect(onReroll).not.toHaveBeenCalled();
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('상단 운명의 실을 누르면 재화 안내가 열리고 받은 방법은 지급 완료로 보인다', () => {
  render(
    <DatingCards
      onOpenReceived={vi.fn()}
      onOpenRequests={vi.fn()}
      onOpenUnlock={vi.fn()}
      onReroll={vi.fn()}
      onSendThread={vi.fn()}
      view={{ ...view, checkedInToday: false }}
    />,
  );

  fireEvent.click(screen.getByRole('button', { name: '운명의 실 획득 방법 보기' }));

  const dialog = screen.getByRole('dialog', { name: '운명의 실 획득 방법' });
  expect(within(dialog).getByText('12개')).toBeInTheDocument();
  // 기본 지급만 받았고 출석은 아직이다. 받은 줄은 개수 대신 '지급 완료'만 보인다(Figma 445:2701).
  const rows = within(dialog).getAllByRole('listitem');
  expect(within(dialog).getAllByText('지급 완료')).toHaveLength(1);
  expect(rows[0]).toHaveTextContent(/지급 완료$/);
  expect(rows[0]).not.toHaveTextContent('+10');
  expect(rows[1]).toHaveTextContent('+5');
  // QA(2026-09-28) 뒤 Figma 522:2739 — '친구에게 공유' · 등록된 사람 5명 당 +3.
  expect(rows[2]).toHaveTextContent('친구에게 공유내 지도에 등록된 사람 5명 당+3');

  fireEvent.click(within(dialog).getByRole('button', { name: '닫기' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

// QA(2026-09-28): 'Top 3' 인데 후보가 모자라면 카드가 한두 장만 보였다 — 남은 자리를 빈 카드로 채운다.
test.each([
  { count: 3, label: '세 명' },
  { count: 2, label: '두 명' },
  { count: 1, label: '한 명' },
])('후보가 $label 이어도 카드 자리와 인디케이터는 세 개다 (FR-26)', ({ count }) => {
  renderCards({ candidates: view.candidates.slice(0, count) });

  const list = screen.getByRole('list', { name: '오늘의 인연' });
  expect(within(list).getAllByRole('listitem')).toHaveLength(3);
  expect(screen.getAllByRole('button', { name: /번째 인연 보기/ })).toHaveLength(3);
  // 채운 자리는 인연x 빈 카드다 — 세 명이면 채울 자리가 없다.
  expect(screen.queryAllByText('운명의 인연을 기다리고 있어요')).toHaveLength(3 - count);
});

test('후보가 0명이면 넘기기 없이 빈 카드 하나만 보인다 (FR-26)', () => {
  renderCards({ candidates: [] });

  expect(screen.queryByRole('list', { name: '오늘의 인연' })).not.toBeInTheDocument();
  expect(screen.getAllByText('운명의 인연을 기다리고 있어요')).toHaveLength(1);
  expect(screen.queryByRole('button', { name: /번째 인연 보기/ })).not.toBeInTheDocument();
});

// 빈 카드도 같은 규격이어야 후보가 모자랄 때 카드 높이가 들쭉날쭉하지 않는다.
test('빈 카드도 카드와 같은 비율을 갖는다 (Figma 134:2248)', () => {
  renderCards({ candidates: [] });

  const empty = screen.getByText('운명의 인연을 기다리고 있어요').closest('div');

  expect(empty).toHaveClass('aspect-[343/433]', 'w-full');
});
