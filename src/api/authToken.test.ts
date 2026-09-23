import { afterEach, expect, test, vi } from 'vitest';

import { clearAuthToken, readAuthToken, writeAuthToken } from './authToken';

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

test('저장한 토큰을 다시 읽는다', () => {
  writeAuthToken('token-1');

  expect(readAuthToken()).toBe('token-1');
});

test('새 토큰을 저장하면 이전 값을 덮어쓴다', () => {
  writeAuthToken('token-1');
  writeAuthToken('token-2');

  expect(readAuthToken()).toBe('token-2');
});

test('저장된 토큰이 없으면 null', () => {
  expect(readAuthToken()).toBeNull();
});

test('지우면 토큰이 없다', () => {
  writeAuthToken('token-1');
  clearAuthToken();

  expect(readAuthToken()).toBeNull();
});

test.each([
  ['JSON 이 아닌 값', 'not-json'],
  ['resultId 세션 값(다른 키의 모양)', JSON.stringify({ v: 2, resultId: 'abc' })],
  ['빈 토큰', JSON.stringify({ v: 1, accessToken: '' })],
])('%s 은 토큰 없음으로 보고 키를 지운다', (_, raw) => {
  localStorage.setItem('wks:auth', raw);

  expect(readAuthToken()).toBeNull();
  expect(localStorage.getItem('wks:auth')).toBeNull();
});

test('스토리지 접근이 막히면 토큰 없음', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new DOMException('blocked', 'SecurityError');
  });

  expect(readAuthToken()).toBeNull();
});

test('저장이 막히면(용량 초과·사생활 보호 모드) 예외 없이 토큰 없음으로 동작한다', () => {
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('full', 'QuotaExceededError');
  });

  expect(() => writeAuthToken('token-1')).not.toThrow();
  expect(readAuthToken()).toBeNull();
});

test('지우기가 막혀도 예외를 던지지 않는다', () => {
  writeAuthToken('token-1');
  vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
    throw new DOMException('blocked', 'SecurityError');
  });

  expect(() => clearAuthToken()).not.toThrow();
});

test('세션(wks:session) 과 별개의 키다', () => {
  localStorage.setItem('wks:session', JSON.stringify({ v: 2, resultId: 'irrelevant' }));

  expect(readAuthToken()).toBeNull();
  expect(localStorage.getItem('wks:session')).not.toBeNull();
});
