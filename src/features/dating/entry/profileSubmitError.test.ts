import { expect, test } from 'vitest';

import { toProfileSubmitError } from './profileSubmitError';

test('사진을 거절당하면 사진을 고치라고 알린다 — 연결 탓으로 읽히지 않게 (2026-09-29 QA)', () => {
  const message = toProfileSubmitError({
    kind: 'api',
    code: 'INVALID_INPUT',
    message: '사진이 너무 큽니다.',
  });

  expect(message).toContain('사진');
  expect(message).toContain('10MB');
  expect(message).not.toContain('연결');
});

test.each([
  ['DATING_PROFILE_CONFLICT', '이미 등록'],
  ['INVALID_EMAIL_DOMAIN', 'dgu.ac.kr'],
  ['UNAUTHENTICATED', '로그인'],
  ['DATING_NOT_VERIFIED', '인증'],
] as const)('%s 는 그 상황에 맞는 안내를 준다', (code, expected) => {
  expect(toProfileSubmitError({ kind: 'api', code, message: '...' })).toContain(expected);
});

test('연결이 끊기면 입력이 남는다는 것까지 알린다', () => {
  expect(toProfileSubmitError({ kind: 'network' })).toBe(
    '연결이 원활하지 않아요. 입력한 내용은 유지됩니다.',
  );
});

test('봉투가 계약과 다르면 연결 문제로 본다', () => {
  expect(toProfileSubmitError({ kind: 'schema' })).toBe(
    '연결이 원활하지 않아요. 입력한 내용은 유지됩니다.',
  );
});

test('모르는 오류 코드도 다시 시도할 수 있다고 알린다', () => {
  const message = toProfileSubmitError({
    kind: 'api',
    code: 'INTERNAL_ERROR',
    message: '서버 오류',
  });

  expect(message).toContain('다시 시도');
  expect(message).toContain('유지');
});
