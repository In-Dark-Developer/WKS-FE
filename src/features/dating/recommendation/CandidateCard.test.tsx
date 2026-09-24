import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { CandidateCard } from './CandidateCard';
import type { MatchCandidateView } from './cardsView';

afterEach(cleanup);

const locked: MatchCandidateView = {
  id: 'c1',
  rank: 1,
  score: 68,
  mbti: 'ENTP',
  bio: '영화와 전시를 좋아해요.',
  photo: { isLocked: true, thumbnailUrl: '/thumb-c1.webp', cost: 10 },
  name: { isLocked: true, cost: 7 },
  department: { isLocked: true, cost: 5 },
  reason: { isLocked: true, cost: 3 },
};

test('앞면에 순위·관계 유형·점수·MBTI·자기소개를 보인다', () => {
  render(<CandidateCard candidate={locked} onOpenUnlock={vi.fn()} />);

  expect(screen.getByText('Top1')).toBeVisible();
  expect(screen.getByText('천생연분')).toBeVisible();
  expect(screen.getByLabelText('궁합 점수 68점')).toBeVisible();
  expect(screen.getByText('ENTP')).toBeVisible();
  expect(screen.getByText('영화와 전시를 좋아해요.')).toBeVisible();
});

test.each([
  [1, '천생연분'],
  [2, '찰떡궁합'],
  [3, '귀한인연'],
] as const)('%i위의 관계 유형은 %s 로 고정한다', (rank, label) => {
  render(<CandidateCard candidate={{ ...locked, rank }} onOpenUnlock={vi.fn()} />);

  expect(screen.getByText(`Top${rank}`)).toBeVisible();
  expect(screen.getByText(label)).toBeVisible();
});

test('잠긴 사진은 썸네일만 그린다', () => {
  render(<CandidateCard candidate={locked} onOpenUnlock={vi.fn()} />);

  expect(screen.getByRole('img', { name: '흐리게 가린 인연 사진' })).toHaveAttribute(
    'src',
    '/thumb-c1.webp',
  );
});

test('뒷면의 잠긴 항목은 비용을 알리고, 열람하기는 그 상대 id 로 해금을 연다', () => {
  const onOpenUnlock = vi.fn();
  render(<CandidateCard candidate={locked} initialFace="back" onOpenUnlock={onOpenUnlock} />);

  expect(screen.getByText('잠겨 있어요 · 운명의 실 7개로 열 수 있어요')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '열람하기' }));

  expect(onOpenUnlock).toHaveBeenCalledWith('c1');
});

test('모두 해금된 뒷면은 값을 보이고 열람하기가 없다', () => {
  const unlocked: MatchCandidateView = {
    ...locked,
    photo: { isLocked: false, url: '/photo-c1.webp' },
    name: { isLocked: false, value: '김채원' },
    department: { isLocked: false, value: '컴퓨터공학과' },
    reason: { isLocked: false, value: '서로의 부족한 기운을 채워 줘요.' },
  };
  render(<CandidateCard candidate={unlocked} initialFace="back" onOpenUnlock={vi.fn()} />);

  expect(screen.getByText('김채원')).toBeVisible();
  expect(screen.getByText('컴퓨터공학과')).toBeVisible();
  expect(screen.queryByRole('button', { name: '열람하기' })).not.toBeInTheDocument();
  expect(screen.getByRole('img', { name: '인연 사진' })).toHaveAttribute('src', '/photo-c1.webp');
});

test('일부만 연 뒷면은 잠긴 항목마다 자물쇠 알약을 두고, 알약은 해금을 연다', () => {
  const onOpenUnlock = vi.fn();
  const nameOnly: MatchCandidateView = { ...locked, name: { isLocked: false, value: '차은호' } };
  render(<CandidateCard candidate={nameOnly} initialFace="back" onOpenUnlock={onOpenUnlock} />);

  expect(screen.queryByRole('button', { name: '열람하기' })).toBeNull();
  expect(screen.getByRole('button', { name: '사진 10개로 열기' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '궁합 이유 3개로 열기' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '학과 5개로 열기' }));

  expect(onOpenUnlock).toHaveBeenCalledWith('c1');
});
