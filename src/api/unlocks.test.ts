import { afterEach, beforeEach, expect, test, vi } from 'vitest';

const { requestMock } = vi.hoisted(() => ({ requestMock: vi.fn() }));
vi.mock('./client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./client')>();
  return { ...actual, request: requestMock };
});

import { getRecommendations, resetMockRecommendations } from './dating';
import { getMe, markMockDatingProfile, resetMockAccount, signInMockAccount } from './me';
import { datingCandidateSchema, datingUnlockResultSchema } from './schema/dating';
import { unlockCandidateField } from './unlocks';

const CANDIDATE_ID = '3f2a9c1e-0000-4000-8000-000000000001';

beforeEach(() => {
  vi.stubEnv('VITE_API_MOCK', 'false');
});

afterEach(() => {
  requestMock.mockReset();
  vi.unstubAllEnvs();
  vi.useRealTimers();
  resetMockAccount();
  resetMockRecommendations();
  localStorage.clear();
});

test('항목 하나를 해금 경로로 보내고 응답을 해금 스키마로 검증한다', async () => {
  requestMock.mockResolvedValue({ ok: true, data: { field: 'NAME', value: '김채원', balance: 3 } });

  const outcome = await unlockCandidateField(CANDIDATE_ID, 'NAME');

  expect(requestMock).toHaveBeenCalledWith(
    { method: 'POST', path: `/dating/candidates/${CANDIDATE_ID}/unlock`, body: { field: 'NAME' } },
    datingUnlockResultSchema,
  );
  expect(outcome).toEqual({ ok: true, data: { field: 'NAME', value: '김채원', balance: 3 } });
});

test('추천 응답의 항목은 잠기면 비용만, 열리면 값만 읽는다 — 반대쪽 null 은 버린다 (§10.4)', () => {
  const parsed = datingCandidateSchema.parse({
    rank: 1,
    candidateId: CANDIDATE_ID,
    score: 90,
    mbti: 'INFP',
    bio: '안녕하세요',
    blurredPhotoUrl: null,
    fields: {
      photo: { locked: true, cost: 10, value: null },
      name: { locked: true, cost: 7, value: null },
      department: { locked: false, cost: null, value: '경영학과' },
      // 열렸는데 값 생성이 실패한 궁합 까닭.
      reason: { locked: false, cost: null, value: null },
    },
  });

  expect(parsed.fields.photo).toEqual({ locked: true, cost: 10 });
  expect(parsed.fields.department).toEqual({ locked: false, value: '경영학과' });
  expect(parsed.fields.reason).toEqual({ locked: false, value: null });
});

// 목 모드 — 가입 지급 10 실, 프로필 등록 뒤 추천 3명.
async function mockCandidateId(): Promise<string> {
  vi.stubEnv('VITE_API_MOCK', 'true');
  signInMockAccount();
  markMockDatingProfile();
  const recommendations = await getRecommendations();
  if (!recommendations.ok) throw new Error('목 추천이 없다');
  const [first] = recommendations.data.candidates;
  if (first === undefined) throw new Error('목 추천이 비었다');
  return first.candidateId;
}

async function balance(): Promise<number> {
  const me = await getMe();
  return me.ok ? me.data.threadBalance : -1;
}

test('목 모드: 비용만큼 잔액을 줄이고 값을 열며, 같은 항목을 다시 열어도 차감하지 않는다 (FR-28)', async () => {
  const candidateId = await mockCandidateId();

  const first = await unlockCandidateField(candidateId, 'NAME');
  expect(first.ok && first.data).toMatchObject({ field: 'NAME', balance: 3 });
  expect(await balance()).toBe(3);

  const again = await unlockCandidateField(candidateId, 'NAME');
  expect(again.ok && again.data.balance).toBe(3);

  const recommendations = await getRecommendations();
  const [card] = recommendations.ok ? recommendations.data.candidates : [];
  expect(card?.fields.name).toEqual({ locked: false, value: '이서연' });
  expect(card?.fields.photo.locked).toBe(true);
});

test('목 모드: 잔액이 모자라면 402 코드로 실패하고 열지도 차감하지도 않는다', async () => {
  const candidateId = await mockCandidateId();
  await unlockCandidateField(candidateId, 'NAME'); // 10 → 3

  const outcome = await unlockCandidateField(candidateId, 'PHOTO');

  expect(outcome).toMatchObject({ ok: false, error: { kind: 'api', code: 'INSUFFICIENT_THREAD' } });
  expect(await balance()).toBe(3);
  const recommendations = await getRecommendations();
  const [card] = recommendations.ok ? recommendations.data.candidates : [];
  expect(card?.fields.photo.locked).toBe(true);
});

test('목 모드: 지금 추천에 없는 상대는 404 코드다', async () => {
  await mockCandidateId();

  const outcome = await unlockCandidateField(CANDIDATE_ID, 'REASON');

  expect(outcome).toMatchObject({
    ok: false,
    error: { kind: 'api', code: 'DATING_PROFILE_NOT_FOUND' },
  });
});
