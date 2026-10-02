import { expect, test, vi } from 'vitest';

import { readDatingCloseAt } from './registrationClose';

test('마감 시각이 없으면 마감하지 않는다', () => {
  expect(readDatingCloseAt(undefined)).toBeNull();
  expect(readDatingCloseAt('')).toBeNull();
});

test('읽을 수 없는 마감 시각은 오류를 남기고 마감하지 않는다', () => {
  const error = vi.spyOn(console, 'error').mockImplementation(() => {});
  expect(readDatingCloseAt('새벽 2시')).toBeNull();
  expect(error).toHaveBeenCalled();
  error.mockRestore();
});

test('오프셋이 붙은 마감 시각을 그 시각으로 읽는다', () => {
  expect(readDatingCloseAt('2026-10-02T02:00:00+09:00')).toBe(Date.UTC(2026, 9, 1, 17, 0, 0));
});
