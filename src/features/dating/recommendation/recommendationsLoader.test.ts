import { afterEach, beforeEach, expect, test, vi } from 'vitest';

const { getWalletMock, getRecommendationsMock } = vi.hoisted(() => ({
  getWalletMock: vi.fn(),
  getRecommendationsMock: vi.fn(),
}));
vi.mock('@/api/wallet', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/wallet')>();
  return { ...actual, getWallet: getWalletMock };
});
const { listRequestsMock } = vi.hoisted(() => ({ listRequestsMock: vi.fn() }));
vi.mock('@/api/matchRequests', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/matchRequests')>();
  return { ...actual, listDatingRequests: listRequestsMock };
});
vi.mock('@/api/dating', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/dating')>();
  return { ...actual, getRecommendations: getRecommendationsMock };
});

import type { DatingCandidate } from '@/api/dating';

import {
  REROLL_COST,
  datingCardsLoader,
  toCandidateView,
  toRerollView,
} from './recommendationsLoader';

const CANDIDATE_ID = '3f2a9c1e-0000-4000-8000-000000000001';

const BLURRED_URL = 'https://s3.example.com/blurred.jpg';

const locked: DatingCandidate = {
  rank: 1,
  candidateId: CANDIDATE_ID,
  score: 90,
  mbti: 'INFP',
  bio: '안녕하세요',
  blurredPhotoUrl: BLURRED_URL,
  fields: {
    photo: { locked: true, cost: 10 },
    name: { locked: true, cost: 7 },
    department: { locked: true, cost: 5 },
    reason: { locked: true, cost: 3 },
  },
};

// 잔액의 단일 출처는 원장(`GET /wallet`)이다 — `/me` 의 threadBalance 는 쓰지 않는다(FR-31).
function wallet(balance: number) {
  return { ok: true, data: { balance, canCheckInToday: true } };
}

beforeEach(() => {
  listRequestsMock.mockResolvedValue({ ok: true, data: [] });
});

afterEach(() => {
  listRequestsMock.mockReset();
  getWalletMock.mockReset();
  getRecommendationsMock.mockReset();
  vi.restoreAllMocks();
});

test('잠긴 항목은 값 없이 비용만 옮긴다 (NFR-4)', () => {
  const view = toCandidateView(locked);

  expect(view).toMatchObject({
    id: CANDIDATE_ID,
    rank: 1,
    score: 90,
    photo: { isLocked: true, thumbnailUrl: BLURRED_URL, cost: 10 },
    name: { isLocked: true, cost: 7 },
  });
  expect(JSON.stringify(view)).not.toContain('value');
});

test('사진이 없는 후보는 썸네일 없이 잠금만 보인다', () => {
  expect(toCandidateView({ ...locked, blurredPhotoUrl: null }).photo).toEqual({
    isLocked: true,
    thumbnailUrl: null,
    cost: 10,
  });
});

test('해금한 항목은 값을 옮긴다', () => {
  const view = toCandidateView({
    ...locked,
    fields: { ...locked.fields, name: { locked: false, value: '김채원' } },
  });

  expect(view.name).toEqual({ isLocked: false, value: '김채원' });
});

test('리롤은 무료가 남으면 free, 아니면 잔액으로 가능 여부를 가른다 (FR-27 · FR-31)', () => {
  expect(toRerollView(true, 0)).toEqual({ kind: 'free' });
  expect(toRerollView(false, REROLL_COST)).toEqual({
    kind: 'paid',
    cost: REROLL_COST,
    canAfford: true,
  });
  expect(toRerollView(false, REROLL_COST - 1)).toMatchObject({ canAfford: false });
});

test('loader 는 잔액과 후보를 함께 싣는다', async () => {
  getWalletMock.mockResolvedValue(wallet(12));
  getRecommendationsMock.mockResolvedValue({ ok: true, data: { candidates: [locked] } });

  const state = await datingCardsLoader();

  expect(state).toMatchObject({ kind: 'ready', view: { balance: 12 } });
  if (state.kind === 'ready') expect(state.view.candidates).toHaveLength(1);
});

test('후보가 0명이면 빈 목록으로 그린다 (FR-26)', async () => {
  getWalletMock.mockResolvedValue(wallet(0));
  getRecommendationsMock.mockResolvedValue({ ok: true, data: { candidates: [] } });

  const state = await datingCardsLoader();

  expect(state).toEqual({
    kind: 'ready',
    view: { balance: 0, candidates: [], reroll: { kind: 'free' } },
  });
});

test('학교 메일 인증 전(403)에는 안내 상태를 돌려준다', async () => {
  getWalletMock.mockResolvedValue(wallet(0));
  getRecommendationsMock.mockResolvedValue({
    ok: false,
    error: { kind: 'api', code: 'DATING_NOT_VERIFIED', message: '학교 메일 인증이 필요해요.' },
  });

  await expect(datingCardsLoader()).resolves.toEqual({ kind: 'not-verified' });
});

test('그 밖의 조회 실패는 오류 화면으로 보낸다', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  getWalletMock.mockResolvedValue(wallet(0));
  getRecommendationsMock.mockResolvedValue({ ok: false, error: { kind: 'network' } });

  await expect(datingCardsLoader()).rejects.toBeInstanceOf(Response);
});

test('열렸는데 값이 아직 없는 항목은 비용 0 잠금으로 두어 다시 열게 한다 (§10.4)', () => {
  const view = toCandidateView({
    ...locked,
    fields: {
      ...locked.fields,
      photo: { locked: false, value: null },
      name: { locked: false, value: '이서연' },
      reason: { locked: false, value: null },
    },
  });

  expect(view.name).toEqual({ isLocked: false, value: '이서연' });
  expect(view.reason).toEqual({ isLocked: true, cost: 0 });
  expect(view.photo).toEqual({ isLocked: true, thumbnailUrl: BLURRED_URL, cost: 0 });
});

test('운명의 실을 보낸 상대 카드에는 보냈다는 표시가 붙는다 (FR-29)', async () => {
  getWalletMock.mockResolvedValue(wallet(10));
  getRecommendationsMock.mockResolvedValue({ ok: true, data: { candidates: [locked] } });
  listRequestsMock.mockResolvedValue({
    ok: true,
    data: [
      {
        requestId: '312f3185-f114-4db0-a2fb-54d0669b7e33',
        candidateId: CANDIDATE_ID,
        status: 'PENDING',
        createdAt: '2026-09-24T12:00:00Z',
        respondedAt: null,
        contactMethod: null,
        contactValue: null,
      },
    ],
  });

  const state = await datingCardsLoader();

  expect(state.kind === 'ready' && state.view.candidates[0]?.isThreadSent).toBe(true);
  expect(listRequestsMock).toHaveBeenCalledWith('sent');
});

test('잔액을 못 읽으면 0 으로 두고 소모를 막는다 (FR-31)', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  getWalletMock.mockResolvedValue({ ok: false, error: { kind: 'network' } });
  getRecommendationsMock.mockResolvedValue({ ok: true, data: { candidates: [locked] } });

  const state = await datingCardsLoader();

  expect(state).toMatchObject({ kind: 'ready', view: { balance: 0 } });
  // 카드는 그대로 보인다 — 잔액만 0 이다.
  if (state.kind === 'ready') expect(state.view.candidates).toHaveLength(1);
});
