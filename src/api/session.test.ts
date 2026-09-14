import { afterEach, expect, test, vi } from 'vitest';

import { clearSession, readSession, writeSession } from './session';

const RESULT_ID = '3f2a9c1e-1111-4111-8111-111111111111';

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

test('저장한 resultId 를 다시 읽는다', () => {
  writeSession(RESULT_ID);

  expect(readSession()).toEqual({ resultId: RESULT_ID });
});

test('새 결과를 저장하면 이전 값을 덮어쓴다', () => {
  writeSession(RESULT_ID);
  writeSession('7b91d26f-2222-4222-8222-222222222222');

  expect(readSession()).toEqual({ resultId: '7b91d26f-2222-4222-8222-222222222222' });
});

test('저장된 세션이 없으면 null', () => {
  expect(readSession()).toBeNull();
});

test('지우면 세션이 없다', () => {
  writeSession(RESULT_ID);
  clearSession();

  expect(readSession()).toBeNull();
});

test.each([
  ['JSON 이 아닌 값', 'not-json'],
  ['예전 토큰 값', JSON.stringify({ v: 1, token: 'token-1' })],
  ['UUID 가 아닌 resultId', JSON.stringify({ v: 2, resultId: 'abc' })],
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
