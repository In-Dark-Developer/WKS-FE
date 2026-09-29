import { expect, test } from 'vitest';

import type { PhotoUploadFailure } from '@/api/uploads';

import { photoErrorMessage } from './photoView';

// 2026-09-29 QA: 용량이 넘쳐도 '연결이 원활하지 않아요' 하나로만 보였다 — 원인마다 문구가 달라야 한다.
const failures: PhotoUploadFailure[] = [
  'type',
  'size',
  'pixels',
  'unreadable',
  'auth',
  'rejected',
  'network',
];

test('원인마다 서로 다른 문구를 준다', () => {
  const messages = failures.map(photoErrorMessage);

  expect(new Set(messages).size).toBe(failures.length);
});

test.each([
  ['type', 'JPEG·PNG'],
  ['size', '10MB'],
  ['pixels', '크기'],
  ['unreadable', '열 수 없어요'],
  ['auth', '로그인'],
  ['network', '연결'],
] as const)('%s 는 무엇이 문제인지 말한다', (failure, expected) => {
  expect(photoErrorMessage(failure)).toContain(expected);
});

test('용량 실패는 연결 문제로 읽히지 않는다', () => {
  expect(photoErrorMessage('size')).not.toContain('연결');
});

test('원인을 모르면 확인할 조건을 알린다', () => {
  expect(photoErrorMessage(undefined)).toContain('10MB');
});
