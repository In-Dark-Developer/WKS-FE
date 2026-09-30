import { afterEach, expect, test, vi } from 'vitest';

const { claimMock } = vi.hoisted(() => ({ claimMock: vi.fn() }));
vi.mock('@/api/wallet', () => ({ claimPartnerReward: claimMock }));

import { takePendingReward } from '@/api/rewards';

import {
  capturePartnerRef,
  claimPendingPartnerRef,
  hasPartnerRef,
  markPartnerEntrySeen,
  readPartnerRef,
  wasPartnerEntrySeen,
} from './partnerRef';

const unauthenticated = {
  ok: false,
  error: { kind: 'api', code: 'UNAUTHENTICATED', message: '로그인이 필요해요.' },
};

afterEach(() => {
  claimMock.mockReset();
  localStorage.clear();
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

test.each([
  ['연결 실패', { kind: 'network' }],
  ['스키마 위반', { kind: 'schema' }],
  [
    '서버 오류(500)',
    { kind: 'api', code: 'INTERNAL_ERROR', message: '잠시 후 다시 시도해 주세요.' },
  ],
])('%s면 ref 를 남겨 다음 진입에 다시 받는다', async (_, error) => {
  capturePartnerRef('?ref=FESTIVAL');
  claimMock.mockResolvedValue({ ok: false, error });

  await claimPendingPartnerRef();

  expect(readPartnerRef()).toBe('FESTIVAL');
});

test('백엔드가 값을 거절하면(INVALID_INPUT) 지운다', async () => {
  capturePartnerRef('?ref=FESTIVAL');
  claimMock.mockResolvedValue({
    ok: false,
    error: { kind: 'api', code: 'INVALID_INPUT', message: 'ref 는 100자 이하여야 합니다.' },
  });

  await claimPendingPartnerRef();

  expect(readPartnerRef()).toBeNull();
});

test('ref 는 탭을 닫아도 남고(localStorage), 진입 안내 표시는 탭 단위다(sessionStorage)', () => {
  capturePartnerRef('?ref=FESTIVAL');
  markPartnerEntrySeen();
  sessionStorage.clear(); // 새 탭

  expect(readPartnerRef()).toBe('FESTIVAL');
  expect(wasPartnerEntrySeen()).toBe(false);
});

test('보관한 ref 가 있어야 로그인 전 안내를 띄운다 (SCR-23 1.1)', () => {
  expect(hasPartnerRef()).toBe(false);

  capturePartnerRef('?ref=FESTIVAL');

  expect(hasPartnerRef()).toBe(true);
});

test('안내를 넘기면 이 탭에서는 다시 띄우지 않는다', () => {
  expect(wasPartnerEntrySeen()).toBe(false);

  markPartnerEntrySeen();

  expect(wasPartnerEntrySeen()).toBe(true);
});

test('안내를 넘겨도 ref 는 남아 나중에 로그인하면 받는다', () => {
  capturePartnerRef('?ref=FESTIVAL');

  markPartnerEntrySeen();

  expect(readPartnerRef()).toBe('FESTIVAL');
});
