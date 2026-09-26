import { afterEach, beforeEach, expect, test, vi } from 'vitest';

const { requestMock } = vi.hoisted(() => ({ requestMock: vi.fn() }));
vi.mock('./client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./client')>();
  return { ...actual, request: requestMock };
});

import {
  acceptDatingRequest,
  cancelDatingRequest,
  listDatingRequests,
  rejectDatingRequest,
  resetMockRequests,
  sendDatingRequest,
} from './matchRequests';
import { datingRequestListSchema, datingRequestSchema } from './schema/matchRequests';

const CANDIDATE_ID = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
const REQUEST_ID = '312f3185-f114-4db0-a2fb-54d0669b7e33';

beforeEach(() => {
  vi.stubEnv('VITE_API_MOCK', 'false');
});

afterEach(() => {
  requestMock.mockReset();
  vi.unstubAllEnvs();
  resetMockRequests();
});

test('보내기·목록·수락·거절·취소를 계약 경로로 부르고 요청 스키마로 검증한다 (§11)', async () => {
  requestMock.mockResolvedValue({ ok: true, data: [] });

  await sendDatingRequest(CANDIDATE_ID);
  await listDatingRequests('received');
  await acceptDatingRequest(REQUEST_ID);
  await rejectDatingRequest(REQUEST_ID);
  await cancelDatingRequest(REQUEST_ID);

  expect(requestMock.mock.calls).toEqual([
    [
      { method: 'POST', path: '/dating/requests', body: { candidateId: CANDIDATE_ID } },
      datingRequestSchema,
    ],
    [{ method: 'GET', path: '/dating/requests?box=received' }, datingRequestListSchema],
    [{ method: 'POST', path: `/dating/requests/${REQUEST_ID}/accept` }, datingRequestSchema],
    [{ method: 'POST', path: `/dating/requests/${REQUEST_ID}/reject` }, datingRequestSchema],
    [{ method: 'POST', path: `/dating/requests/${REQUEST_ID}/cancel` }, datingRequestSchema],
  ]);
});

test('요청 응답은 연락처가 ACCEPTED 일 때만 온다 — 그 밖에는 null 을 그대로 받는다', () => {
  const pending = datingRequestSchema.parse({
    requestId: REQUEST_ID,
    candidateId: CANDIDATE_ID,
    status: 'PENDING',
    createdAt: '2026-09-24T12:00:00Z',
    respondedAt: null,
    contactMethod: null,
    contactValue: null,
  });

  expect(pending.contactValue).toBeNull();
  expect(datingRequestSchema.parse({ ...pending, status: 'CANCELLED' }).status).toBe('CANCELLED');
  expect(() => datingRequestSchema.parse({ ...pending, status: 'FAILED' })).toThrow();
});

test('목록 행은 상대 프로필(counterpart)을 받고, 잠긴 값은 비용만 남긴다 (§11.1)', () => {
  const [row] = datingRequestListSchema.parse([
    {
      requestId: REQUEST_ID,
      candidateId: CANDIDATE_ID,
      status: 'CANCELLED',
      createdAt: '2026-09-24T12:00:00Z',
      respondedAt: '2026-09-24T12:05:00Z',
      contactMethod: null,
      contactValue: null,
      counterpart: {
        score: 83,
        mbti: 'INFP',
        bio: '안녕하세요',
        blurredPhotoUrl: 'https://s3.example.com/blurred',
        fields: {
          photo: { locked: true, cost: 10, value: null },
          name: { locked: false, cost: null, value: '홍길동' },
          department: { locked: true, cost: 5, value: null },
        },
      },
    },
  ]);

  expect(row?.counterpart.fields.photo).toEqual({ locked: true, cost: 10 });
  expect(row?.counterpart.fields.name).toEqual({ locked: false, value: '홍길동' });
});

test('목 모드: 같은 상대에게 두 번 보내면 409 이고, 보낸 신청 목록에 한 번만 있다', async () => {
  vi.stubEnv('VITE_API_MOCK', 'true');
  vi.useFakeTimers({ shouldAdvanceTime: true });

  const first = await sendDatingRequest(CANDIDATE_ID);
  const again = await sendDatingRequest(CANDIDATE_ID);
  const sent = await listDatingRequests('sent');

  expect(first).toMatchObject({ ok: true, data: { candidateId: CANDIDATE_ID, status: 'PENDING' } });
  expect(again).toMatchObject({ ok: false, error: { code: 'DATING_REQUEST_CONFLICT' } });
  expect(sent.ok && sent.data).toHaveLength(1);
  vi.useRealTimers();
});

test('목 모드: 보낸 신청을 취소하면 CANCELLED 로 남고, 다시 취소하면 409, 같은 상대에게 다시 보낼 수 있다', async () => {
  vi.stubEnv('VITE_API_MOCK', 'true');
  vi.useFakeTimers({ shouldAdvanceTime: true });

  const first = await sendDatingRequest(CANDIDATE_ID);
  if (!first.ok) throw new Error('목 보내기 실패');
  const cancelled = await cancelDatingRequest(first.data.requestId);
  const again = await cancelDatingRequest(first.data.requestId);
  const resent = await sendDatingRequest(CANDIDATE_ID);
  const sent = await listDatingRequests('sent');

  expect(cancelled).toMatchObject({ ok: true, data: { status: 'CANCELLED', contactValue: null } });
  expect(cancelled.ok && 'counterpart' in cancelled.data).toBe(false);
  expect(again).toMatchObject({ ok: false, error: { code: 'DATING_REQUEST_CONFLICT' } });
  expect(resent).toMatchObject({ ok: true, data: { status: 'PENDING' } });
  expect(sent.ok && sent.data.map((each) => each.status)).toEqual(['PENDING', 'CANCELLED']);
  vi.useRealTimers();
});

test('목 모드: 받은 신청을 수락하면 연락처가 오고, 이미 응답한 신청은 409 다', async () => {
  vi.stubEnv('VITE_API_MOCK', 'true');
  const received = await listDatingRequests('received');
  const [first] = received.ok ? received.data : [];
  if (first === undefined) throw new Error('목 받은 신청이 없다');

  const accepted = await acceptDatingRequest(first.requestId);
  const again = await rejectDatingRequest(first.requestId);

  expect(accepted).toMatchObject({
    ok: true,
    data: { status: 'ACCEPTED', contactMethod: 'INSTAGRAM' },
  });
  expect(again).toMatchObject({ ok: false, error: { code: 'DATING_REQUEST_CONFLICT' } });
});

test('목 모드: 거절하면 연락처가 공개되지 않는다', async () => {
  vi.stubEnv('VITE_API_MOCK', 'true');
  const received = await listDatingRequests('received');
  const [first] = received.ok ? received.data : [];
  if (first === undefined) throw new Error('목 받은 신청이 없다');

  const rejected = await rejectDatingRequest(first.requestId);

  expect(rejected).toMatchObject({
    ok: true,
    data: { status: 'REJECTED', contactMethod: null, contactValue: null },
  });
});
