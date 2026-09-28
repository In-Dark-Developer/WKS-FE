import { afterEach, beforeEach, expect, test, vi } from 'vitest';

const { requestMock } = vi.hoisted(() => ({ requestMock: vi.fn() }));
vi.mock('./client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./client')>();
  return { ...actual, request: requestMock };
});

import { resetMockAccount, signInMockAccount } from './me';
import { partnerRewardSchema, walletCheckInSchema, walletSchema } from './schema/wallet';
import {
  checkInWallet,
  claimPartnerReward,
  ensureDailyCheckIn,
  getWallet,
  resetDailyCheckIn,
} from './wallet';

beforeEach(() => {
  vi.stubEnv('VITE_API_MOCK', 'false');
});

afterEach(() => {
  requestMock.mockReset();
  vi.unstubAllEnvs();
  resetMockAccount();
  resetDailyCheckIn();
  localStorage.clear();
});

test('getWallet 은 GET /wallet 을 원장 스키마로 부른다', async () => {
  const wallet = { balance: 18, canCheckInToday: true };
  requestMock.mockResolvedValue({ ok: true, data: wallet });

  await expect(getWallet()).resolves.toEqual({ ok: true, data: wallet });
  expect(requestMock).toHaveBeenCalledWith({ method: 'GET', path: '/wallet' }, walletSchema);
});

test('checkInWallet 은 POST /wallet/check-in 을 부른다', async () => {
  requestMock.mockResolvedValue({ ok: true, data: { checkedIn: true, balance: 23 } });

  await expect(checkInWallet()).resolves.toMatchObject({ ok: true, data: { checkedIn: true } });
  expect(requestMock).toHaveBeenCalledWith(
    { method: 'POST', path: '/wallet/check-in' },
    walletCheckInSchema,
  );
});

test('목 모드는 가입 지급 10 을 최초 로그인에 한 번만 준다 (백엔드 §12)', async () => {
  vi.stubEnv('VITE_API_MOCK', 'true');

  signInMockAccount();
  await expect(getWallet()).resolves.toEqual({
    ok: true,
    data: { balance: 10, canCheckInToday: true },
  });

  // 다시 로그인해도 가입 지급은 늘지 않는다.
  signInMockAccount();
  await expect(getWallet()).resolves.toMatchObject({ ok: true, data: { balance: 10 } });
  expect(requestMock).not.toHaveBeenCalled();
});

test('목 모드 출석은 하루 한 번만 5 를 준다', async () => {
  vi.stubEnv('VITE_API_MOCK', 'true');
  signInMockAccount();

  await expect(checkInWallet()).resolves.toEqual({
    ok: true,
    data: { checkedIn: true, balance: 15 },
  });
  // 같은 날 다시 부르면 오류가 아니라 checkedIn: false 다.
  await expect(checkInWallet()).resolves.toEqual({
    ok: true,
    data: { checkedIn: false, balance: 15 },
  });
  await expect(getWallet()).resolves.toEqual({
    ok: true,
    data: { balance: 15, canCheckInToday: false },
  });
});

test('접속 출석은 페이지를 연 동안 한 번만 부른다', async () => {
  requestMock.mockResolvedValue({ ok: true, data: { checkedIn: true, balance: 15 } });

  await Promise.all([ensureDailyCheckIn(), ensureDailyCheckIn()]);
  await ensureDailyCheckIn();

  expect(requestMock).toHaveBeenCalledOnce();
  expect(requestMock).toHaveBeenCalledWith(
    { method: 'POST', path: '/wallet/check-in' },
    walletCheckInSchema,
  );
});

test('비로그인(401)으로 실패하면 다음 호출에서 다시 출석한다 — 로그인 뒤 받을 수 있게', async () => {
  requestMock
    .mockResolvedValueOnce({
      ok: false,
      error: { kind: 'api', code: 'UNAUTHENTICATED', message: '로그인이 필요합니다.' },
    })
    .mockResolvedValueOnce({ ok: true, data: { checkedIn: true, balance: 15 } });

  await ensureDailyCheckIn();
  await ensureDailyCheckIn();

  expect(requestMock).toHaveBeenCalledTimes(2);
});

test('claimPartnerReward 는 POST /wallet/partner-rewards 에 ref 를 싣는다 (FR-32)', async () => {
  const data = { rewardGranted: { partnerName: '동국대 축제', amount: 10 }, balance: 20 };
  requestMock.mockResolvedValue({ ok: true, data });

  await expect(claimPartnerReward('FESTIVAL')).resolves.toEqual({ ok: true, data });
  expect(requestMock).toHaveBeenCalledWith(
    { method: 'POST', path: '/wallet/partner-rewards', body: { ref: 'FESTIVAL' } },
    partnerRewardSchema,
  );
});
