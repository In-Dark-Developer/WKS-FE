import { afterEach, expect, test, vi } from 'vitest';

import { clearSession, readSession, writeSession } from './session';

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

test('저장한 토큰을 다시 읽는다', () => {
  writeSession('token-1');

  expect(readSession()).toEqual({ token: 'token-1' });
});

test('저장된 세션이 없으면 null', () => {
  expect(readSession()).toBeNull();
});

test('지우면 세션이 없다', () => {
  writeSession('token-1');
  clearSession();

  expect(readSession()).toBeNull();
});

test.each([
  ['JSON 이 아닌 값', 'not-json'],
  ['버전이 다른 값', JSON.stringify({ v: 2, token: 'token-1' })],
  ['토큰이 빈 값', JSON.stringify({ v: 1, token: '' })],
])('%s 은 세션 없음으로 보고 키를 지운다', (_, raw) => {
  localStorage.setItem('wks:session', raw);

  expect(readSession()).toBeNull();
  expect(localStorage.getItem('wks:session')).toBeNull();
});

test('스토리지 접근이 막히면 세션 없음', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new DOMException('blocked', 'SecurityError');
  });

  expect(readSession()).toBeNull();
});
