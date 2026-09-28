import { afterEach, expect, test, vi } from 'vitest';

const { claimMock } = vi.hoisted(() => ({ claimMock: vi.fn() }));
vi.mock('@/api/wallet', () => ({ claimPartnerReward: claimMock }));

import { takePendingReward } from '@/api/rewards';

import { capturePartnerRef, claimPendingPartnerRef, readPartnerRef } from './partnerRef';

const unauthenticated = {
  ok: false,
  error: { kind: 'api', code: 'UNAUTHENTICATED', message: '로그인이 필요해요.' },
};

afterEach(() => {
  claimMock.mockReset();
  sessionStorage.clear();
});

test('진입 주소의 ref 를 보관하고, ref 가 없는 주소는 보관한 값을 지우지 않는다', () => {
  capturePartnerRef('?ref=FESTIVAL');
  capturePartnerRef('?code=abc');

  expect(readPartnerRef()).toBe('FESTIVAL');
});

test('빈 값이나 100자를 넘는 ref 는 보관하지 않는다', () => {
  capturePartnerRef('?ref=%20%20');
  capturePartnerRef(`?ref=${'A'.repeat(101)}`);

  expect(readPartnerRef()).toBeNull();
});

test('보관한 ref 가 없으면 보상을 부르지 않는다', async () => {
  await claimPendingPartnerRef();

  expect(claimMock).not.toHaveBeenCalled();
});

test('로그인 상태면 바로 받고, 지급을 소개팅 모달용으로 남긴 뒤 ref 를 지운다', async () => {
  capturePartnerRef('?ref=FESTIVAL');
  const reward = { partnerName: '동국대 축제', amount: 10 };
  claimMock.mockResolvedValue({ ok: true, data: { rewardGranted: reward, balance: 20 } });

  await claimPendingPartnerRef();

  expect(claimMock).toHaveBeenCalledWith('FESTIVAL');
  expect(takePendingReward()).toEqual(reward);
  expect(readPartnerRef()).toBeNull();
});

test('비로그인(401)이면 ref 를 남겨 로그인 요청이 싣게 한다', async () => {
  capturePartnerRef('?ref=FESTIVAL');
  claimMock.mockResolvedValue(unauthenticated);

  await claimPendingPartnerRef();

  expect(readPartnerRef()).toBe('FESTIVAL');
});

test('연결 실패면 남기고, 백엔드가 거절한 값이면 지운다', async () => {
  capturePartnerRef('?ref=FESTIVAL');
  claimMock.mockResolvedValue({ ok: false, error: { kind: 'network' } });
  await claimPendingPartnerRef();
  expect(readPartnerRef()).toBe('FESTIVAL');

  claimMock.mockResolvedValue({
    ok: false,
    error: { kind: 'api', code: 'INVALID_INPUT', message: 'ref 는 100자 이하여야 합니다.' },
  });
  await claimPendingPartnerRef();
  expect(readPartnerRef()).toBeNull();
});
