import { expect, test } from 'vitest';

import { toEmailVerificationError, toResendAt } from './emailVerification';

test.each([
  ['INVALID_EMAIL_DOMAIN', 'invalid-domain'],
  ['DATING_PROFILE_CONFLICT', 'conflict'],
  ['EMAIL_CODE_RATE_LIMITED', 'rate-limited'],
  ['INVALID_EMAIL_CODE', 'invalid-code'],
  ['MAIL_UNAVAILABLE', 'mail-unavailable'],
] as const)('%s 는 %s 로 옮긴다 (WKS-BE §10.7)', (code, expected) => {
  expect(toEmailVerificationError({ kind: 'api', code, message: '' })).toBe(expected);
});

test('연결 실패와 모르는 코드는 다시 시도 안내로 묶는다', () => {
  expect(toEmailVerificationError({ kind: 'network' })).toBe('mail-unavailable');
  expect(toEmailVerificationError({ kind: 'api', code: 'INTERNAL_ERROR', message: '' })).toBe(
    'mail-unavailable',
  );
});

test('재발송 시각을 읽을 수 없으면 타이머를 걸지 않는다', () => {
  expect(toResendAt('2026-09-27T12:01:00Z')).toBe(Date.parse('2026-09-27T12:01:00Z'));
  expect(toResendAt('나중에')).toBeUndefined();
});
