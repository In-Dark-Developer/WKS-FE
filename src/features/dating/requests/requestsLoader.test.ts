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
import type { DatingRequestListItem } from '@/api/matchRequests';

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

const lockedCounterpart: DatingRequestListItem['counterpart'] = {
  score: 87,
  mbti: 'INFJ',
  bio: '책 읽는 걸 좋아해요.',
  blurredPhotoUrl: null,
  fields: {
    photo: { locked: true, cost: 10 },
    name: { locked: false, value: '박지훈' },
    department: { locked: true, cost: 5 },
  },
};

function request(overrides: Partial<DatingRequestListItem>): DatingRequestListItem {
  return {
    requestId: crypto.randomUUID(),
    candidateId: CANDIDATE_ID,
    status: 'PENDING',
    createdAt: '2026-09-24T12:00:00Z',
    respondedAt: null,
    contactMethod: null,
    contactValue: null,
    counterpart: lockedCounterpart,
    ...overrides,
  };
}

afterEach(() => {
  listMock.mockReset();
  getRecommendationsMock.mockReset();
  vi.restoreAllMocks();
});

test('보낸 신청은 counterpart 로 채우고, 거절은 매칭 실패·수락은 연락처와 성립·취소는 목록에서 뺀다', async () => {
  const pending = request({});
  const accepted = request({
    candidateId: crypto.randomUUID(),
    status: 'ACCEPTED',
    contactMethod: 'PHONE',
    contactValue: '010-3333-3333',
    counterpart: {
      ...lockedCounterpart,
      score: 71,
      fields: { ...lockedCounterpart.fields, name: { locked: true, cost: 7 } },
    },
  });
  const rejected = request({ candidateId: crypto.randomUUID(), status: 'REJECTED' });
  const cancelled = request({ candidateId: crypto.randomUUID(), status: 'CANCELLED' });
  listMock.mockImplementation((box: string) =>
    Promise.resolve({
      ok: true,
      data: box === 'sent' ? [pending, accepted, rejected, cancelled] : [],
    }),
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
    rank: null,
    score: 71,
    relationLabel: '보낸 인연',
    contact: { method: 'PHONE', value: '010-3333-3333' },
    name: { isLocked: true, cost: 7 },
    reason: { isLocked: true, cost: 0 },
  });
  expect(view.sent[2]).toMatchObject({ status: 'FAILED', contact: null });
  expect(view.sent).toHaveLength(3);
});

test('받은 신청은 counterpart 의 열린 프로필과 궁합 점수를 보인다 (FR-30)', async () => {
  const received = request({
    status: 'ACCEPTED',
    contactMethod: 'INSTAGRAM',
    contactValue: 'fate',
    counterpart: {
      score: 92,
      mbti: 'ISTJ',
      bio: '같이 부스 구경해요.',
      blurredPhotoUrl: 'https://s3.example.com/blurred',
      fields: {
        photo: { locked: false, value: 'https://s3.example.com/original' },
        name: { locked: false, value: '김운명' },
        department: { locked: false, value: '국어국문학과' },
      },
    },
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
      rank: null,
      score: 92,
      relationLabel: '나를 찾아온 인연',
      contact: { method: 'INSTAGRAM', value: 'fate' },
      photo: { isLocked: false, url: 'https://s3.example.com/original' },
      name: { isLocked: false, value: '김운명' },
      department: { isLocked: false, value: '국어국문학과' },
      reason: { isLocked: true, cost: 0 },
    }),
  ]);
});

test('목록을 못 읽으면 오류 화면으로 보낸다(503)', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  listMock.mockResolvedValue({ ok: false, error: { kind: 'network' } });
  getRecommendationsMock.mockResolvedValue({ ok: true, data: { candidates: [] } });

  await expect(datingRequestsLoader()).rejects.toMatchObject({ status: 503 });
});
