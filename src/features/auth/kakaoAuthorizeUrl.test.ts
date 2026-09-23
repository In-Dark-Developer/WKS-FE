import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { buildKakaoAuthorizeUrl, consumeKakaoState } from './kakaoAuthorizeUrl';

beforeEach(() => {
  vi.stubEnv('VITE_KAKAO_CLIENT_ID', 'test-client-id');
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  sessionStorage.clear();
});

test('client_id·redirect_uri·response_type 을 담은 카카오 인가 URL 을 만든다', () => {
  const url = new URL(buildKakaoAuthorizeUrl('http://localhost:5173/dev/kakao-callback'));

  expect(url.origin + url.pathname).toBe('https://kauth.kakao.com/oauth/authorize');
  expect(url.searchParams.get('client_id')).toBe('test-client-id');
  expect(url.searchParams.get('redirect_uri')).toBe('http://localhost:5173/dev/kakao-callback');
  expect(url.searchParams.get('response_type')).toBe('code');
  expect(url.searchParams.get('state')).toBeTruthy();
});

test('client id 가 없으면 에러를 던진다', () => {
  vi.stubEnv('VITE_KAKAO_CLIENT_ID', '');

  expect(() => buildKakaoAuthorizeUrl('http://localhost:5173/x')).toThrow();
});

test('만든 state 를 그대로 돌려주면 통과한다', () => {
  const url = new URL(buildKakaoAuthorizeUrl('http://localhost:5173/x'));
  const state = url.searchParams.get('state');

  expect(consumeKakaoState(state)).toBe(true);
});

test('state 가 다르면 실패한다', () => {
  buildKakaoAuthorizeUrl('http://localhost:5173/x');

  expect(consumeKakaoState('forged-state')).toBe(false);
});

test('state 를 한 번 쓰면 다시 쓸 수 없다(재사용 방지)', () => {
  const url = new URL(buildKakaoAuthorizeUrl('http://localhost:5173/x'));
  const state = url.searchParams.get('state');

  expect(consumeKakaoState(state)).toBe(true);
  expect(consumeKakaoState(state)).toBe(false);
});

test('저장된 state 가 없으면 실패한다', () => {
  expect(consumeKakaoState('anything')).toBe(false);
});

test('받은 state 가 null 이면 실패한다', () => {
  buildKakaoAuthorizeUrl('http://localhost:5173/x');

  expect(consumeKakaoState(null)).toBe(false);
});
