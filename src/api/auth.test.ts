import { z } from 'zod';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

const { requestMock } = vi.hoisted(() => ({ requestMock: vi.fn() }));
vi.mock('./client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./client')>();
  return { ...actual, request: requestMock };
});

import { loginWithKakao, logout } from './auth';
import { getMe, isUnauthenticated, resetMockAccount } from './me';
import { readSession, writeSession } from './session';
import { kakaoLoginResultSchema } from './schema/auth';

const INPUT = {
  code: 'auth-code',
  redirectUri: 'http://localhost:3000/auth/kakao/callback',
  resultId: '3f2a9c1e-1111-4111-8111-111111111111',
  ref: null,
};

beforeEach(() => {
  vi.stubEnv('VITE_API_MOCK', 'false');
});

afterEach(() => {
  requestMock.mockReset();
  vi.unstubAllEnvs();
  resetMockAccount();
});

test('loginWithKakao 는 POST /auth/kakao 에 코드·resultId 를 보내고 토큰 없는 응답을 검증한다', async () => {
  const data = { isNewUser: true, restoredResultId: null, rewardGranted: null };
  requestMock.mockResolvedValue({ ok: true, data });

  await expect(loginWithKakao(INPUT)).resolves.toEqual({ ok: true, data });
  expect(requestMock).toHaveBeenCalledWith(
    { method: 'POST', path: '/auth/kakao', body: INPUT },
    kakaoLoginResultSchema,
  );
});

test('로그인 응답 스키마에는 token 이 없다 — 세션은 쿠키로만 온다', () => {
  const parsed = kakaoLoginResultSchema.parse({
    token: 'jwt',
    isNewUser: false,
    restoredResultId: null,
    rewardGranted: null,
  });
  expect(parsed).not.toHaveProperty('token');
});

test('logout 은 POST /auth/logout 을 부르고 data null 을 기대한다', async () => {
  requestMock.mockResolvedValue({ ok: true, data: null });

  await expect(logout()).resolves.toEqual({ ok: true, data: null });
  const [input, schema] = requestMock.mock.calls[0] as [unknown, z.ZodType];
  expect(input).toEqual({ method: 'POST', path: '/auth/logout' });
  expect(schema.safeParse(null).success).toBe(true);
});

test('logout 이 성공하면 이 브라우저의 내 결과를 지운다', async () => {
  writeSession(INPUT.resultId);
  requestMock.mockResolvedValue({ ok: true, data: null });

  await logout();

  expect(readSession()).toBeNull();
});

test('logout 이 실패하면 로그인 상태 그대로라 내 결과를 남긴다', async () => {
  writeSession(INPUT.resultId);
  requestMock.mockResolvedValue({ ok: false, error: { kind: 'network' } });

  await logout();

  expect(readSession()).toEqual({ resultId: INPUT.resultId });
});

test('목 모드는 요청 없이 목 계정을 켜고 끈다', async () => {
  vi.stubEnv('VITE_API_MOCK', 'true');

  await expect(loginWithKakao(INPUT)).resolves.toMatchObject({ ok: true });
  expect((await getMe()).ok).toBe(true);

  await logout();
  expect(isUnauthenticated(await getMe())).toBe(true);
  expect(requestMock).not.toHaveBeenCalled();
});

test('목 로그인은 백엔드 규칙대로 계정이 비었을 때만 연결하고, 다음 로그인에서 계정 결과를 복원한다', async () => {
  vi.stubEnv('VITE_API_MOCK', 'true');
  const OTHER = '9b1d2c3e-2222-4222-8222-222222222222';

  await expect(loginWithKakao(INPUT)).resolves.toMatchObject({
    ok: true,
    data: { restoredResultId: null },
  });
  await logout();

  // 다른 브라우저 결과로 다시 로그인해도 계정 결과가 이긴다.
  await expect(loginWithKakao({ ...INPUT, resultId: OTHER })).resolves.toMatchObject({
    ok: true,
    data: { restoredResultId: INPUT.resultId },
  });
  await logout();
  // 브라우저 결과 없이(새 기기) 로그인해도 복원된다.
  await expect(loginWithKakao({ ...INPUT, resultId: null })).resolves.toMatchObject({
    ok: true,
    data: { restoredResultId: INPUT.resultId },
  });
});
