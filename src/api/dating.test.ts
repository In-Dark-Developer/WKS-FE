import { afterEach, beforeEach, expect, test, vi } from 'vitest';

const { requestMock } = vi.hoisted(() => ({ requestMock: vi.fn() }));
vi.mock('./client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./client')>();
  return { ...actual, request: requestMock };
});

import {
  REROLL_PAID_COST,
  createDatingProfile,
  getRecommendations,
  rerollRecommendations,
  resetMockRecommendations,
  type DatingProfileRequest,
} from './dating';
import {
  getMe,
  linkMockAccountResult,
  resetMockAccount,
  signInMockAccount,
  spendMockThread,
} from './me';
import { datingProfileSchema, datingRerollResultSchema } from './schema/dating';
import { clearSession, writeSession } from './session';

const RESULT_ID = '3f2a9c1e-1111-4111-8111-111111111111';
const PHOTO_ID = 'f1c4832a-0000-4000-8000-000000000002';

const input: DatingProfileRequest = {
  email: 'chaewon@dgu.ac.kr',
  name: '김채원',
  contactMethod: 'PHONE',
  contactValue: '01012345678',
  department: '컴퓨터공학과',
  mbti: 'ENTP',
  bio: '영화와 전시를 좋아해요.',
  photoId: PHOTO_ID,
};

beforeEach(() => {
  vi.stubEnv('VITE_API_MOCK', 'false');
});

afterEach(() => {
  requestMock.mockReset();
  vi.unstubAllEnvs();
  vi.useRealTimers();
  resetMockAccount();
  resetMockRecommendations();
  clearSession();
  localStorage.clear();
});

test('POST /dating/profile 로 계약대로의 본문을 보낸다 — resultId 는 싣지 않는다', async () => {
  const profile = { ...input, candidateId: RESULT_ID, emailVerified: false };
  requestMock.mockResolvedValue({ ok: true, data: profile });

  await expect(createDatingProfile(input)).resolves.toEqual({ ok: true, data: profile });
  expect(requestMock).toHaveBeenCalledWith(
    { method: 'POST', path: '/dating/profile', body: input },
    datingProfileSchema,
  );
  expect(requestMock.mock.calls[0]?.[0].body).not.toHaveProperty('resultId');
});

test('목 모드는 계정에 연결된 결과가 없으면 백엔드처럼 RESULT_NOT_FOUND 로 막는다', async () => {
  vi.stubEnv('VITE_API_MOCK', 'true');
  vi.useFakeTimers();
  signInMockAccount();

  const pending = createDatingProfile(input);
  await vi.runAllTimersAsync();

  await expect(pending).resolves.toMatchObject({
    ok: false,
    error: { kind: 'api', code: 'RESULT_NOT_FOUND' },
  });
  expect(requestMock).not.toHaveBeenCalled();
});

test('목 모드에서 저장하면 내 정보가 프로필 등록 완료로 바뀐다', async () => {
  vi.stubEnv('VITE_API_MOCK', 'true');
  vi.useFakeTimers();
  signInMockAccount();
  linkMockAccountResult(RESULT_ID);

  const pending = createDatingProfile(input);
  await vi.runAllTimersAsync();

  await expect(pending).resolves.toMatchObject({ ok: true, data: { emailVerified: true } });
  await expect(getMe()).resolves.toMatchObject({ ok: true, data: { hasDatingProfile: true } });
});

test('목 모드는 이 브라우저의 사주를 계정에 연결해 준다 (백엔드는 로그인 때만 연결한다)', async () => {
  vi.stubEnv('VITE_API_MOCK', 'true');
  vi.useFakeTimers();
  signInMockAccount();
  writeSession(RESULT_ID);

  const pending = createDatingProfile(input);
  await vi.runAllTimersAsync();

  await expect(pending).resolves.toMatchObject({ ok: true });
});

test('리롤은 POST /dating/recommendations/reroll 을 부른다', async () => {
  const result = { candidates: [], rerollCost: 5, threadBalance: 10 };
  requestMock.mockResolvedValue({ ok: true, data: result });

  await expect(rerollRecommendations()).resolves.toEqual({ ok: true, data: result });
  expect(requestMock).toHaveBeenCalledWith(
    { method: 'POST', path: '/dating/recommendations/reroll' },
    datingRerollResultSchema,
  );
});

test('목 리롤은 하루 한 번 무료고 그 뒤에는 5 실을 쓴다 (WKS-BE §10.4.1)', async () => {
  vi.stubEnv('VITE_API_MOCK', 'true');
  vi.useFakeTimers();
  signInMockAccount(); // 가입 지급 10

  // 첫 조회는 무료(rerollCost 0)다.
  await expect(getRecommendations()).resolves.toMatchObject({
    ok: true,
    data: { rerollCost: 0 },
  });

  const free = rerollRecommendations();
  await vi.runAllTimersAsync();
  await expect(free).resolves.toMatchObject({
    ok: true,
    data: { rerollCost: REROLL_PAID_COST, threadBalance: 10 },
  });

  const paid = rerollRecommendations();
  await vi.runAllTimersAsync();
  await expect(paid).resolves.toMatchObject({ ok: true, data: { threadBalance: 5 } });
  expect(requestMock).not.toHaveBeenCalled();
});

test('목 리롤은 잔액이 모자라면 402 로 막고 카드를 두 번 바꾸지 않는다', async () => {
  vi.stubEnv('VITE_API_MOCK', 'true');
  vi.useFakeTimers();
  signInMockAccount();
  // 무료 한 번을 쓰고, 남은 잔액을 5 미만으로 만든다.
  const free = rerollRecommendations();
  await vi.runAllTimersAsync();
  await free;
  spendMockThread(7);

  const blocked = rerollRecommendations();
  await vi.runAllTimersAsync();

  await expect(blocked).resolves.toMatchObject({
    ok: false,
    error: { kind: 'api', code: 'INSUFFICIENT_THREAD' },
  });
});
