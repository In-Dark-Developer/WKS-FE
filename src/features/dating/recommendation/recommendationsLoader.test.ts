import { afterEach, expect, test, vi } from 'vitest';

const { getMeMock, getRecommendationsMock } = vi.hoisted(() => ({
  getMeMock: vi.fn(),
  getRecommendationsMock: vi.fn(),
}));
vi.mock('@/api/me', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/me')>();
  return { ...actual, getMe: getMeMock };
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

const locked: DatingCandidate = {
  rank: 1,
  candidateId: CANDIDATE_ID,
  score: 90,
  mbti: 'INFP',
  bio: '안녕하세요',
  fields: {
    photo: { locked: true, cost: 10 },
    name: { locked: true, cost: 7 },
    department: { locked: true, cost: 5 },
    reason: { locked: true, cost: 3 },
  },
};

function me(threadBalance: number) {
  return {
    ok: true,
    data: { memberId: 1, hasResult: true, hasDatingProfile: true, threadBalance },
  };
}

afterEach(() => {
  getMeMock.mockReset();
  getRecommendationsMock.mockReset();
  vi.restoreAllMocks();
});

test('잠긴 항목은 값 없이 비용만 옮긴다 (NFR-4)', () => {
  const view = toCandidateView(locked);

  expect(view).toMatchObject({
    id: CANDIDATE_ID,
    rank: 1,
    score: 90,
    photo: { isLocked: true, thumbnailUrl: null, cost: 10 },
    name: { isLocked: true, cost: 7 },
  });
  expect(JSON.stringify(view)).not.toContain('value');
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
  getMeMock.mockResolvedValue(me(12));
  getRecommendationsMock.mockResolvedValue({ ok: true, data: { candidates: [locked] } });

  const state = await datingCardsLoader();

  expect(state).toMatchObject({ kind: 'ready', view: { balance: 12 } });
  if (state.kind === 'ready') expect(state.view.candidates).toHaveLength(1);
});

test('후보가 0명이면 빈 목록으로 그린다 (FR-26)', async () => {
  getMeMock.mockResolvedValue(me(0));
  getRecommendationsMock.mockResolvedValue({ ok: true, data: { candidates: [] } });

  const state = await datingCardsLoader();

  expect(state).toEqual({
    kind: 'ready',
    view: { balance: 0, candidates: [], reroll: { kind: 'free' } },
  });
});

test('학교 메일 인증 전(403)에는 안내 상태를 돌려준다', async () => {
  getMeMock.mockResolvedValue(me(0));
  getRecommendationsMock.mockResolvedValue({
    ok: false,
    error: { kind: 'api', code: 'DATING_NOT_VERIFIED', message: '학교 메일 인증이 필요해요.' },
  });

  await expect(datingCardsLoader()).resolves.toEqual({ kind: 'not-verified' });
});

test('그 밖의 조회 실패는 오류 화면으로 보낸다', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  getMeMock.mockResolvedValue(me(0));
  getRecommendationsMock.mockResolvedValue({ ok: false, error: { kind: 'network' } });

  await expect(datingCardsLoader()).rejects.toBeInstanceOf(Response);
});
