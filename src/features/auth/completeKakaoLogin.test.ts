import { afterEach, beforeEach, expect, test, vi } from 'vitest';

const { loginWithKakaoMock } = vi.hoisted(() => ({ loginWithKakaoMock: vi.fn() }));
vi.mock('@/api/auth', () => ({ loginWithKakao: loginWithKakaoMock }));

import { readAuthToken } from '@/api/authToken';
import { clearSession, writeSession } from '@/api/session';

import { completeKakaoLogin } from './completeKakaoLogin';
import { buildKakaoAuthorizeUrl } from './kakaoAuthorizeUrl';

const REDIRECT_URI = 'http://localhost:5173/dev/kakao-callback';
const RESULT_ID = '3f2a9c1e-1111-4111-8111-111111111111';

// 로그인을 시작한 것처럼 유효한 state 를 sessionStorage 에 미리 심어 둔다.
function validState(): string {
  const url = new URL(buildKakaoAuthorizeUrl(REDIRECT_URI));
  return url.searchParams.get('state')!;
}

beforeEach(() => {
  vi.stubEnv('VITE_KAKAO_CLIENT_ID', 'test-client-id');
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  loginWithKakaoMock.mockReset();
  sessionStorage.clear();
  localStorage.clear();
});

test('카카오가 error 를 실어 보내면 kakao-error 다', async () => {
  const result = await completeKakaoLogin(
    new URLSearchParams({ error: 'access_denied' }),
    REDIRECT_URI,
  );

  expect(result).toEqual({ kind: 'kakao-error', error: 'access_denied' });
  expect(loginWithKakaoMock).not.toHaveBeenCalled();
});

test('state 가 없거나 다르면 state-mismatch 다', async () => {
  const result = await completeKakaoLogin(
    new URLSearchParams({ code: 'auth-code', state: 'forged' }),
    REDIRECT_URI,
  );

  expect(result).toEqual({ kind: 'state-mismatch' });
  expect(loginWithKakaoMock).not.toHaveBeenCalled();
});

test('state 는 맞는데 code 가 없으면 missing-code 다', async () => {
  const state = validState();

  const result = await completeKakaoLogin(new URLSearchParams({ state }), REDIRECT_URI);

  expect(result).toEqual({ kind: 'missing-code' });
  expect(loginWithKakaoMock).not.toHaveBeenCalled();
});

test('브라우저에 내 결과가 없으면 resultId 없이 로그인하고 토큰을 저장한다', async () => {
  clearSession();
  const state = validState();
  loginWithKakaoMock.mockResolvedValue({
    ok: true,
    data: { token: 'jwt-1', isNewUser: true, restoredResultId: null, rewardGranted: null },
  });

  const result = await completeKakaoLogin(
    new URLSearchParams({ code: 'auth-code', state }),
    REDIRECT_URI,
  );

  expect(result.kind).toBe('success');
  expect(loginWithKakaoMock).toHaveBeenCalledWith({
    code: 'auth-code',
    redirectUri: REDIRECT_URI,
    resultId: null,
    ref: null,
  });
  expect(readAuthToken()).toBe('jwt-1');
});

test('브라우저에 내 결과가 있으면 resultId 를 함께 보낸다(plan §1.1 연결·복원)', async () => {
  writeSession(RESULT_ID);
  const state = validState();
  loginWithKakaoMock.mockResolvedValue({
    ok: true,
    data: { token: 'jwt-2', isNewUser: false, restoredResultId: RESULT_ID, rewardGranted: null },
  });

  await completeKakaoLogin(new URLSearchParams({ code: 'auth-code', state }), REDIRECT_URI);

  expect(loginWithKakaoMock).toHaveBeenCalledWith(expect.objectContaining({ resultId: RESULT_ID }));
});

test('백엔드 호출이 실패하면 api-error 이고 토큰을 저장하지 않는다', async () => {
  const state = validState();
  loginWithKakaoMock.mockResolvedValue({
    ok: false,
    error: {
      kind: 'api',
      code: 'KAKAO_UNAVAILABLE',
      message: '카카오 로그인을 일시적으로 사용할 수 없습니다.',
    },
  });

  const result = await completeKakaoLogin(
    new URLSearchParams({ code: 'auth-code', state }),
    REDIRECT_URI,
  );

  expect(result).toEqual({
    kind: 'api-error',
    error: {
      kind: 'api',
      code: 'KAKAO_UNAVAILABLE',
      message: '카카오 로그인을 일시적으로 사용할 수 없습니다.',
    },
  });
  expect(readAuthToken()).toBeNull();
});

test('같은 state 로 두 번 부르면 두 번째는 state-mismatch 다(재사용 방지)', async () => {
  const state = validState();
  loginWithKakaoMock.mockResolvedValue({
    ok: true,
    data: { token: 'jwt-1', isNewUser: true, restoredResultId: null, rewardGranted: null },
  });

  await completeKakaoLogin(new URLSearchParams({ code: 'auth-code', state }), REDIRECT_URI);
  const second = await completeKakaoLogin(
    new URLSearchParams({ code: 'auth-code', state }),
    REDIRECT_URI,
  );

  expect(second).toEqual({ kind: 'state-mismatch' });
  expect(loginWithKakaoMock).toHaveBeenCalledTimes(1);
});
