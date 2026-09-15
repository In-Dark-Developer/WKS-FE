import { afterEach, expect, test, vi } from 'vitest';

import { clearPendingShare, readPendingShare, writePendingShare } from './pendingShare';

const SHARE_ID = '5a951b51-21d5-4601-91b9-560de47aaaca';

afterEach(() => {
  sessionStorage.clear();
  vi.restoreAllMocks();
});

test('보관한 shareId 를 읽고 지우면 없다', () => {
  writePendingShare(SHARE_ID);
  expect(readPendingShare()).toBe(SHARE_ID);

  clearPendingShare();
  expect(readPendingShare()).toBeNull();
});

test('모양이 틀린 값은 없음으로 보고 지운다', () => {
  sessionStorage.setItem('wks:pending-share', JSON.stringify({ v: 1, shareId: 'not-a-uuid' }));
  expect(readPendingShare()).toBeNull();
  expect(sessionStorage.getItem('wks:pending-share')).toBeNull();

  sessionStorage.setItem('wks:pending-share', '{broken');
  expect(readPendingShare()).toBeNull();
});

test('스토리지가 막히면 없음으로 본다', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('blocked');
  });

  expect(readPendingShare()).toBeNull();
});
