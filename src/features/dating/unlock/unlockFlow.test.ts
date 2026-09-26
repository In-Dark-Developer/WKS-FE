import { afterEach, expect, test, vi } from 'vitest';

import type { ApiOutcome } from '@/api/client';
import type { DatingUnlockField, DatingUnlockResult } from '@/api/unlocks';

import type { MatchCandidateView } from '../recommendation/cardsView';
import { toUnlockOptions, unlockItems } from './unlockFlow';

const candidate: MatchCandidateView = {
  id: 'c1',
  rank: 1,
  score: 98,
  mbti: 'ENTP',
  bio: '안녕하세요',
  photo: { isLocked: true, thumbnailUrl: null, cost: 10 },
  name: { isLocked: false, value: '이서연' },
  department: { isLocked: true, cost: 5 },
  reason: { isLocked: true, cost: 0 },
};

function answer(field: DatingUnlockField, balance: number): ApiOutcome<DatingUnlockResult> {
  return { ok: true, data: { field, value: '값', balance } };
}

afterEach(() => {
  vi.restoreAllMocks();
});

test('잠긴 항목은 백엔드 비용으로, 연 항목은 비활성으로 모달 칸을 만든다', () => {
  expect(toUnlockOptions(candidate)).toEqual([
    { item: 'photo', cost: 10, isUnlocked: false },
    { item: 'name', cost: 7, isUnlocked: true },
    { item: 'department', cost: 5, isUnlocked: false },
    // 값 생성이 실패한 항목 — 다시 열면 차감이 없다.
    { item: 'reason', cost: 0, isUnlocked: false },
  ]);
});

test('고른 항목을 모달 순서대로 하나씩 열고 마지막 잔액을 남긴다', async () => {
  const unlock = vi
    .fn()
    .mockResolvedValueOnce(answer('PHOTO', 13))
    .mockResolvedValueOnce(answer('REASON', 10));

  const run = await unlockItems('c1', ['reason', 'photo'], unlock);

  expect(unlock.mock.calls).toEqual([
    ['c1', 'PHOTO'],
    ['c1', 'REASON'],
  ]);
  expect(run).toEqual({ opened: ['photo', 'reason'], balance: 10, failure: null });
});

test('잔액이 모자라면 거기서 멈추고 앞서 연 항목만 남긴다', async () => {
  const unlock = vi
    .fn()
    .mockResolvedValueOnce(answer('NAME', 3))
    .mockResolvedValueOnce({
      ok: false,
      error: { kind: 'api', code: 'INSUFFICIENT_THREAD', message: '부족' },
    });

  const run = await unlockItems('c1', ['name', 'department', 'reason'], unlock);

  expect(unlock).toHaveBeenCalledTimes(2);
  expect(run).toEqual({ opened: ['name'], balance: 3, failure: 'short' });
});

test('연결이 실패하면 원인을 콘솔에 남기고 아무것도 열지 않는다', async () => {
  const error = vi.spyOn(console, 'error').mockImplementation(() => {});
  const unlock = vi.fn().mockResolvedValue({ ok: false, error: { kind: 'network' } });

  const run = await unlockItems('c1', ['photo'], unlock);

  expect(run).toEqual({ opened: [], balance: null, failure: 'error' });
  expect(error).toHaveBeenCalled();
});
