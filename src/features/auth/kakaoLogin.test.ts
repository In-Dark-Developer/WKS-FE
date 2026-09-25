import { afterEach, beforeEach, expect, test, vi } from 'vitest';

const { loginMock } = vi.hoisted(() => ({ loginMock: vi.fn() }));
vi.mock('@/api/auth', () => ({ loginWithKakao: loginMock }));

import { clearSession, readSession, writeSession } from '@/api/session';

import { completeKakaoLogin, KAKAO_CALLBACK_PATH, startKakaoLogin } from './kakaoLogin';

const RESULT_ID = '3f2a9c1e-1111-4111-8111-111111111111';
const CALLBACK_URI = `${window.location.origin}${KAKAO_CALLBACK_PATH}`;

function stateOf(url: string): string {
  return new URL(url, window.location.origin).searchParams.get('state') ?? '';
}

beforeEach(() => {
  vi.stubEnv('VITE_API_MOCK', 'false');
  vi.stubEnv('VITE_KAKAO_CLIENT_ID', 'kakao-client');
  loginMock.mockResolvedValue({
    ok: true,
    data: { isNewUser: false, restoredResultId: null, rewardGranted: null },
  });
});

afterEach(() => {
  loginMock.mockReset();
  vi.unstubAllEnvs();
  sessionStorage.clear();
  clearSession();
});

test('실제 모드는 카카오 인가 URL 에 client_id·콜백 주소·state 를 싣는다', () => {
  const url = new URL(startKakaoLogin('/dating'));

  expect(url.origin + url.pathname).toBe('https://kauth.kakao.com/oauth/authorize');
  expect(url.searchParams.get('client_id')).toBe('kakao-client');
  expect(url.searchParams.get('redirect_uri')).toBe(CALLBACK_URI);
  expect(url.searchParams.get('response_type')).toBe('code');
  expect(url.searchParams.get('state')).not.toBe('');
});

test('클라이언트 ID 가 없으면 시작하지 않는다', () => {
  vi.stubEnv('VITE_KAKAO_CLIENT_ID', '');
  expect(() => startKakaoLogin('/')).toThrow();
});

test('목 모드는 카카오를 거치지 않고 가짜 코드로 콜백 경로에 간다', () => {
  vi.stubEnv('VITE_API_MOCK', 'true');
  const url = new URL(startKakaoLogin('/'), window.location.origin);

  expect(url.pathname).toBe(KAKAO_CALLBACK_PATH);
  expect(url.searchParams.get('code')).toBe('mock-code');
});

test('콜백은 이 브라우저의 resultId 를 함께 보내고 시작한 화면으로 돌려보낸다', async () => {
  writeSession(RESULT_ID);
  const state = stateOf(startKakaoLogin('/dating'));

  const result = await completeKakaoLogin(new URLSearchParams({ code: 'c1', state }));

  expect(result).toEqual({
    returnTo: '/dating',
    outcome: { kind: 'success', restoredResultId: null },
  });
  expect(loginMock).toHaveBeenCalledWith({
    code: 'c1',
    redirectUri: CALLBACK_URI,
    resultId: RESULT_ID,
    ref: null,
  });
});

test('state 가 다르거나 같은 콜백을 다시 열면 로그인하지 않고 / 로 보낸다', async () => {
  const state = stateOf(startKakaoLogin('/dating'));

  await expect(
    completeKakaoLogin(new URLSearchParams({ code: 'c1', state: 'other' })),
  ).resolves.toEqual({ returnTo: '/', outcome: { kind: 'state-mismatch' } });
  await expect(completeKakaoLogin(new URLSearchParams({ code: 'c1', state }))).resolves.toEqual({
    returnTo: '/',
    outcome: { kind: 'state-mismatch' },
  });
  expect(loginMock).not.toHaveBeenCalled();
});

test('카카오 취소·백엔드 실패도 시작한 화면으로 돌려보낸다', async () => {
  let state = stateOf(startKakaoLogin('/dating'));
  await expect(
    completeKakaoLogin(new URLSearchParams({ error: 'access_denied', state })),
  ).resolves.toEqual({
    returnTo: '/dating',
    outcome: { kind: 'kakao-error', error: 'access_denied' },
  });

  loginMock.mockResolvedValue({ ok: false, error: { kind: 'network' } });
  state = stateOf(startKakaoLogin('/dating'));
  await expect(completeKakaoLogin(new URLSearchParams({ code: 'c1', state }))).resolves.toEqual({
    returnTo: '/dating',
    outcome: { kind: 'api-error', error: { kind: 'network' } },
  });
});

test('외부로 나가는 복귀 경로는 / 로 바꾼다', async () => {
  const state = stateOf(startKakaoLogin('//evil.example'));

  const result = await completeKakaoLogin(new URLSearchParams({ code: 'c1', state }));

  expect(result.returnTo).toBe('/');
});

test('계정 결과가 복원되면 세션을 그 값으로 바꾸고 복귀 경로의 옛 id 를 고친다', async () => {
  const ACCOUNT_ID = '9b1d2c3e-2222-4222-8222-222222222222';
  writeSession(RESULT_ID);
  loginMock.mockResolvedValue({
    ok: true,
    data: { isNewUser: false, restoredResultId: ACCOUNT_ID, rewardGranted: null },
  });
  const state = stateOf(startKakaoLogin(`/reading/${RESULT_ID}`));

  const result = await completeKakaoLogin(new URLSearchParams({ code: 'c1', state }));

  expect(result.returnTo).toBe(`/reading/${ACCOUNT_ID}`);
  expect(readSession()).toEqual({ resultId: ACCOUNT_ID });
});

test('새 기기(세션 없음)에서도 계정 결과를 세션에 넣는다', async () => {
  loginMock.mockResolvedValue({
    ok: true,
    data: { isNewUser: false, restoredResultId: RESULT_ID, rewardGranted: null },
  });
  const state = stateOf(startKakaoLogin('/'));

  await completeKakaoLogin(new URLSearchParams({ code: 'c1', state }));

  expect(readSession()).toEqual({ resultId: RESULT_ID });
});

test('취소·실패하면 이 브라우저의 세션을 건드리지 않는다', async () => {
  writeSession(RESULT_ID);
  loginMock.mockResolvedValue({
    ok: false,
    error: { kind: 'api', code: 'KAKAO_UNAVAILABLE', message: 'x' },
  });
  let state = stateOf(startKakaoLogin('/me/map'));
  await completeKakaoLogin(new URLSearchParams({ code: 'c1', state }));
  state = stateOf(startKakaoLogin('/me/map'));
  await completeKakaoLogin(new URLSearchParams({ error: 'access_denied', state }));

  expect(readSession()).toEqual({ resultId: RESULT_ID });
});
