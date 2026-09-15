import { afterEach, expect, test, vi } from 'vitest';

import { hasJoinedShare, markShareJoined } from './joinedShares';

const SHARE_ID = '5a951b51-21d5-4601-91b9-560de47aaaca';
const OTHER_SHARE_ID = '11111111-1111-4111-8111-111111111111';

afterEach(() => {
  sessionStorage.clear();
  vi.restoreAllMocks();
});

test('궁합을 만든 링크만 기록되고 같은 링크는 한 번만 남는다', () => {
  expect(hasJoinedShare(SHARE_ID)).toBe(false);

  markShareJoined(SHARE_ID);
  markShareJoined(SHARE_ID);

  expect(hasJoinedShare(SHARE_ID)).toBe(true);
  expect(hasJoinedShare(OTHER_SHARE_ID)).toBe(false);
  expect(sessionStorage.getItem('wks:joined-shares')).toBe(
    JSON.stringify({ v: 1, shareIds: [SHARE_ID] }),
  );
});

test('모양이 틀린 기록은 없음으로 보고 지운다', () => {
  sessionStorage.setItem('wks:joined-shares', '{broken');

  expect(hasJoinedShare(SHARE_ID)).toBe(false);
  expect(sessionStorage.getItem('wks:joined-shares')).toBeNull();
});

test('스토리지가 막히면 기록 없음으로 본다', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('blocked');
  });

  expect(hasJoinedShare(SHARE_ID)).toBe(false);
});
