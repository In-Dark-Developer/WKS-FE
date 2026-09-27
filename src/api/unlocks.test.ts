import { afterEach, beforeEach, expect, test, vi } from 'vitest';

const { requestMock } = vi.hoisted(() => ({ requestMock: vi.fn() }));
vi.mock('./client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./client')>();
  return { ...actual, request: requestMock };
});

import { getRecommendations, resetMockRecommendations } from './dating';
import { getMe, markMockDatingProfile, resetMockAccount, signInMockAccount } from './me';
import { datingCandidateSchema, datingUnlockResultSchema } from './schema/dating';
import { unlockCandidateFields } from './unlocks';

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

test('고른 항목을 fields 배열로 보내고 응답을 해금 스키마로 검증한다 (§10.5)', async () => {
  const data = { values: { PHOTO: 'https://s3/photo', NAME: '김채원' }, balance: 3 };
  requestMock.mockResolvedValue({ ok: true, data });

  const outcome = await unlockCandidateFields(CANDIDATE_ID, ['PHOTO', 'NAME']);

  expect(requestMock).toHaveBeenCalledWith(
    {
      method: 'POST',
      path: `/dating/candidates/${CANDIDATE_ID}/unlock`,
      body: { fields: ['PHOTO', 'NAME'] },
    },
    datingUnlockResultSchema,
  );
  expect(outcome).toEqual({ ok: true, data });
});

test('해금 응답은 values 맵을 읽고 옛 field·value 모양은 받지 않는다', () => {
  expect(
    datingUnlockResultSchema.safeParse({ field: 'NAME', value: '김채원', balance: 3 }).success,
  ).toBe(false);
  expect(datingUnlockResultSchema.parse({ values: { REASON: '까닭' }, balance: 0 }).values).toEqual(
    { REASON: '까닭' },
  );
});

test('빈 배열은 보내기 전에 막는다 — 백엔드는 400 이다', async () => {
  await expect(unlockCandidateFields(CANDIDATE_ID, [])).rejects.toThrow();
  expect(requestMock).not.toHaveBeenCalled();
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

  const first = await unlockCandidateFields(candidateId, ['NAME']);
  expect(first.ok && first.data).toEqual({ values: { NAME: '이서연' }, balance: 3 });
  expect(await balance()).toBe(3);

  const again = await unlockCandidateFields(candidateId, ['NAME']);
  expect(again.ok && again.data.balance).toBe(3);

  const recommendations = await getRecommendations();
  const [card] = recommendations.ok ? recommendations.data.candidates : [];
  expect(card?.fields.name).toEqual({ locked: false, value: '이서연' });
  expect(card?.fields.photo.locked).toBe(true);
});

test('목 모드: 여러 항목은 잠긴 것의 합만큼 한 번에 줄인다', async () => {
  const candidateId = await mockCandidateId();
  await unlockCandidateFields(candidateId, ['NAME']); // 10 → 3

  const outcome = await unlockCandidateFields(candidateId, ['NAME', 'REASON']);

  expect(outcome.ok && outcome.data.balance).toBe(0);
  expect(outcome.ok && Object.keys(outcome.data.values)).toEqual(['NAME', 'REASON']);
});

test('목 모드: 합계가 잔액보다 크면 402 코드로 실패하고 하나도 열지 않는다', async () => {
  const candidateId = await mockCandidateId();

  const outcome = await unlockCandidateFields(candidateId, ['NAME', 'PHOTO']); // 17 > 10

  expect(outcome).toMatchObject({ ok: false, error: { kind: 'api', code: 'INSUFFICIENT_THREAD' } });
  expect(await balance()).toBe(10);
  const recommendations = await getRecommendations();
  const [card] = recommendations.ok ? recommendations.data.candidates : [];
  expect(card?.fields.name.locked).toBe(true);
  expect(card?.fields.photo.locked).toBe(true);
});

test('목 모드: 지금 추천에 없는 상대는 404 코드다', async () => {
  await mockCandidateId();

  const outcome = await unlockCandidateFields(CANDIDATE_ID, ['REASON']);

  expect(outcome).toMatchObject({
    ok: false,
    error: { kind: 'api', code: 'DATING_PROFILE_NOT_FOUND' },
  });
});
