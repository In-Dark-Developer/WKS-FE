import { afterEach, beforeEach, expect, test, vi } from 'vitest';

const { requestMock } = vi.hoisted(() => ({ requestMock: vi.fn() }));
vi.mock('./client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./client')>();
  return { ...actual, request: requestMock };
});

import {
  getMe,
  isUnauthenticated,
  markMockDatingProfile,
  signInMockAccount,
  signOutMockAccount,
} from './me';
import { meSchema } from './schema/me';
import { clearSession, writeSession } from './session';

const RESULT_ID = '3f2a9c1e-1111-4111-8111-111111111111';

beforeEach(() => {
  // 로컬 `.env` 의 VITE_API_MOCK 과 무관하게 기본은 실제 모드다(results.test.ts 와 같은 규칙).
  vi.stubEnv('VITE_API_MOCK', 'false');
});

afterEach(() => {
  requestMock.mockReset();
  vi.unstubAllEnvs();
  signOutMockAccount();
  clearSession();
});

test('getMe 는 GET /me 를 부르고 응답을 계약 스키마로 검증한다', async () => {
  const me = { memberId: 12, hasResult: true, hasDatingProfile: false, threadBalance: 0 };
  requestMock.mockResolvedValue({ ok: true, data: me });

  await expect(getMe()).resolves.toEqual({ ok: true, data: me });
  expect(requestMock).toHaveBeenCalledWith({ method: 'GET', path: '/me' }, meSchema);
});

test('401 UNAUTHENTICATED 만 비로그인으로 본다', () => {
  expect(
    isUnauthenticated({
      ok: false,
      error: { kind: 'api', code: 'UNAUTHENTICATED', message: '로그인이 필요해요.' },
    }),
  ).toBe(true);
  expect(isUnauthenticated({ ok: false, error: { kind: 'network' } })).toBe(false);
  expect(isUnauthenticated({ ok: true, data: null })).toBe(false);
});

test('목 모드는 로그인 전 401, 로그인 뒤 이 브라우저의 사주와 등록 상태를 돌려준다', async () => {
  vi.stubEnv('VITE_API_MOCK', 'true');

  expect(isUnauthenticated(await getMe())).toBe(true);

  signInMockAccount();
  await expect(getMe()).resolves.toMatchObject({
    ok: true,
    data: { hasResult: false, hasDatingProfile: false },
  });

  writeSession(RESULT_ID);
  markMockDatingProfile();
  await expect(getMe()).resolves.toMatchObject({
    ok: true,
    data: { hasResult: true, hasDatingProfile: true },
  });
  expect(requestMock).not.toHaveBeenCalled();
});
