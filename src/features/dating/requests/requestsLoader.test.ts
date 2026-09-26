import { afterEach, expect, test, vi } from 'vitest';

const { listMock, getRecommendationsMock } = vi.hoisted(() => ({
  listMock: vi.fn(),
  getRecommendationsMock: vi.fn(),
}));
vi.mock('@/api/matchRequests', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/matchRequests')>();
  return { ...actual, listDatingRequests: listMock };
});
vi.mock('@/api/dating', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/dating')>();
  return { ...actual, getRecommendations: getRecommendationsMock };
});

import type { DatingCandidate } from '@/api/dating';
import type { DatingRequest } from '@/api/matchRequests';

import { datingRequestsLoader } from './requestsLoader';

const CANDIDATE_ID = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

const candidate: DatingCandidate = {
  rank: 2,
  candidateId: CANDIDATE_ID,
  score: 87,
  mbti: 'INFJ',
  bio: '책 읽는 걸 좋아해요.',
  blurredPhotoUrl: null,
  fields: {
    photo: { locked: true, cost: 10 },
    name: { locked: false, value: '박지훈' },
    department: { locked: true, cost: 5 },
    reason: { locked: true, cost: 3 },
  },
};

function request(overrides: Partial<DatingRequest>): DatingRequest {
  return {
    requestId: crypto.randomUUID(),
    candidateId: CANDIDATE_ID,
    status: 'PENDING',
    createdAt: '2026-09-24T12:00:00Z',
    respondedAt: null,
    contactMethod: null,
    contactValue: null,
    ...overrides,
  };
}

afterEach(() => {
  listMock.mockReset();
  getRecommendationsMock.mockReset();
  vi.restoreAllMocks();
});

test('보낸 신청은 지금 카드의 상대로 채우고, 거절은 매칭 실패·수락은 연락처와 성립으로 보인다', async () => {
  const pending = request({});
  const accepted = request({
    candidateId: crypto.randomUUID(),
    status: 'ACCEPTED',
    contactMethod: 'PHONE',
    contactValue: '010-3333-3333',
  });
  const rejected = request({ candidateId: crypto.randomUUID(), status: 'REJECTED' });
  listMock.mockImplementation((box: string) =>
    Promise.resolve({ ok: true, data: box === 'sent' ? [pending, accepted, rejected] : [] }),
  );
  getRecommendationsMock.mockResolvedValue({ ok: true, data: { candidates: [candidate] } });

  const view = await datingRequestsLoader();

  expect(view.sent[0]).toMatchObject({
    id: pending.requestId,
    status: 'PENDING',
    score: 87,
    relationLabel: '찰떡궁합',
    name: { isLocked: false, value: '박지훈' },
  });
  expect(view.sent[1]).toMatchObject({
    status: 'MATCHED',
    contact: { method: 'PHONE', value: '010-3333-3333' },
    name: { isLocked: true },
  });
  expect(view.sent[2]).toMatchObject({ status: 'FAILED', contact: null });
});

test('받은 신청은 프로필 없이 가린 채 상태와 연락처만 옮긴다 — 백엔드가 프로필을 주지 않는다', async () => {
  const received = request({
    status: 'ACCEPTED',
    contactMethod: 'INSTAGRAM',
    contactValue: 'fate',
  });
  listMock.mockImplementation((box: string) =>
    Promise.resolve({ ok: true, data: box === 'received' ? [received] : [] }),
  );
  getRecommendationsMock.mockResolvedValue({ ok: true, data: { candidates: [candidate] } });

  const view = await datingRequestsLoader();

  expect(view.received).toEqual([
    expect.objectContaining({
      id: received.requestId,
      status: 'MATCHED',
      score: null,
      contact: { method: 'INSTAGRAM', value: 'fate' },
      name: { isLocked: true, cost: 0 },
    }),
  ]);
});

test('목록을 못 읽으면 오류 화면으로 보낸다(503)', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  listMock.mockResolvedValue({ ok: false, error: { kind: 'network' } });
  getRecommendationsMock.mockResolvedValue({ ok: true, data: { candidates: [] } });

  await expect(datingRequestsLoader()).rejects.toMatchObject({ status: 503 });
});
