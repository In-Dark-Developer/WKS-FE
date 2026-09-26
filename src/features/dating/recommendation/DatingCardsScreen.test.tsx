import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';

const { rerollMock, unlockMock, sendMock } = vi.hoisted(() => ({
  rerollMock: vi.fn(),
  unlockMock: vi.fn(),
  sendMock: vi.fn(),
}));
vi.mock('@/api/matchRequests', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/matchRequests')>();
  return { ...actual, sendDatingRequest: sendMock };
});
vi.mock('@/api/dating', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/dating')>();
  return { ...actual, rerollRecommendations: rerollMock };
});
vi.mock('@/api/unlocks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/unlocks')>();
  return { ...actual, unlockCandidateField: unlockMock };
});

import type { DatingCardsView, MatchCandidateView } from './cardsView';
import {
  DatingCardsScreen,
  REROLL_FAILED_MESSAGE,
  THREAD_FAILED_MESSAGE,
  UNLOCK_SHORT_MESSAGE,
} from './DatingCardsScreen';

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
  unlockMock.mockReset();
  sendMock.mockReset();
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

// 11/T1 해금 — 카드 뒷면의 '열람하기' → 해금 모달 → 고른 항목을 열고 완료 모달 (FR-28).

function openUnlockDialog() {
  fireEvent.click(screen.getByRole('button', { name: '카드 뒤집기' }));
  fireEvent.click(screen.getByRole('button', { name: '열람하기' }));
}

test('고른 항목을 열고 남은 실과 연 항목을 완료 모달로 알린다', async () => {
  unlockMock.mockResolvedValue({ ok: true, data: { field: 'NAME', value: '이서연', balance: 3 } });
  renderScreen({ balance: 10, candidates: [candidate], reroll: { kind: 'free' } });

  openUnlockDialog();
  fireEvent.click(await screen.findByRole('button', { name: /이름/ }));
  fireEvent.click(screen.getByRole('button', { name: '7개 사용하기' }));

  expect(await screen.findByRole('heading', { name: /정보를 열었어요/ })).toBeInTheDocument();
  expect(unlockMock).toHaveBeenCalledWith('c1', 'NAME');
  expect(screen.getAllByLabelText('운명의 실 보유 3개').length).toBeGreaterThan(0);
});

test('잔액이 모자라 백엔드가 거절하면 열지 않고 알린다', async () => {
  unlockMock.mockResolvedValue({
    ok: false,
    error: { kind: 'api', code: 'INSUFFICIENT_THREAD', message: '부족' },
  });
  renderScreen({ balance: 10, candidates: [candidate], reroll: { kind: 'free' } });

  openUnlockDialog();
  fireEvent.click(await screen.findByRole('button', { name: /사진/ }));
  fireEvent.click(screen.getByRole('button', { name: '10개 사용하기' }));

  expect(await screen.findByRole('status')).toHaveTextContent(UNLOCK_SHORT_MESSAGE);
  expect(screen.queryByRole('heading', { name: /정보를 열었어요/ })).not.toBeInTheDocument();
});

// 11/T2 운명의 실 보내기 (FR-29).

test('열지 않은 항목이 남았으면 확인받고 보낸 뒤 보낸 모달을 띄운다', async () => {
  sendMock.mockResolvedValue({ ok: true, data: { requestId: 'r1', candidateId: 'c1' } });
  renderScreen({ balance: 10, candidates: [candidate], reroll: { kind: 'free' } });

  fireEvent.click(screen.getByRole('button', { name: '운명의 실 보내기' }));
  expect(sendMock).not.toHaveBeenCalled();
  fireEvent.click(await screen.findByRole('button', { name: '보내기' }));

  expect(await screen.findByRole('button', { name: '보러가기' })).toBeInTheDocument();
  expect(sendMock).toHaveBeenCalledWith('c1');
});

test('확인에서 취소하면 보내지 않는다', async () => {
  renderScreen({ balance: 10, candidates: [candidate], reroll: { kind: 'free' } });

  fireEvent.click(screen.getByRole('button', { name: '운명의 실 보내기' }));
  fireEvent.click(await screen.findByRole('button', { name: '취소' }));

  expect(sendMock).not.toHaveBeenCalled();
});

test('전송이 실패하면 보낸 모달 없이 알린다', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  sendMock.mockResolvedValue({ ok: false, error: { kind: 'network' } });
  const opened = {
    ...candidate,
    photo: { isLocked: false as const, url: 'https://example.com/p.jpg' },
    name: { isLocked: false as const, value: '이서연' },
    department: { isLocked: false as const, value: '영화영상학과' },
    reason: { isLocked: false as const, value: '잘 맞아요' },
  };
  renderScreen({ balance: 10, candidates: [opened], reroll: { kind: 'free' } });

  // 다 열었으면 확인 없이 바로 보낸다.
  fireEvent.click(screen.getByRole('button', { name: '운명의 실 보내기' }));

  expect(await screen.findByRole('status')).toHaveTextContent(THREAD_FAILED_MESSAGE);
  expect(screen.queryByRole('button', { name: '보러가기' })).not.toBeInTheDocument();
});

test('이미 보낸 상대는 다시 보낼 수 없고 더 열 수도 없다', () => {
  renderScreen({
    balance: 10,
    candidates: [{ ...candidate, isThreadSent: true }],
    reroll: { kind: 'free' },
  });

  expect(screen.getByRole('button', { name: '운명의 실을 보냈어요' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: '카드 뒤집기' }));
  expect(screen.queryByRole('button', { name: '열람하기' })).not.toBeInTheDocument();
});
