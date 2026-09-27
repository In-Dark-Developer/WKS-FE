import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

const { getWalletMock } = vi.hoisted(() => ({ getWalletMock: vi.fn() }));
vi.mock('@/api/wallet', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/wallet')>();
  return { ...actual, getWallet: getWalletMock };
});

import { rememberPendingReward } from '@/api/rewards';

import { PendingRewardDialog } from './PendingRewardDialog';

afterEach(() => {
  cleanup();
  sessionStorage.clear();
  getWalletMock.mockReset();
  vi.restoreAllMocks();
});

test('제휴 지급이 남아 있으면 받은 개수와 보유 수를 알린다 (FR-32)', async () => {
  rememberPendingReward({ partnerName: '축사', amount: 10 });
  getWalletMock.mockResolvedValue({ ok: true, data: { balance: 20, canCheckInToday: true } });

  render(<PendingRewardDialog />);

  expect(await screen.findByRole('dialog')).toHaveTextContent('운명의 실이');
  expect(screen.getByText(/운명의 실 10개를 드렸어요/)).toBeInTheDocument();
  expect(screen.getByLabelText('운명의 실 보유 20개')).toBeInTheDocument();
});

test('지급이 없으면 아무것도 뜨지 않는다 (rewardGranted null)', () => {
  render(<PendingRewardDialog />);

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(getWalletMock).not.toHaveBeenCalled();
});

test('닫으면 사라지고 다시 그려도 뜨지 않는다', async () => {
  rememberPendingReward({ partnerName: '축사', amount: 10 });
  getWalletMock.mockResolvedValue({ ok: true, data: { balance: 20, canCheckInToday: true } });

  const { unmount } = render(<PendingRewardDialog />);
  fireEvent.click(await screen.findByRole('button', { name: '운명의 짝 찾아보기' }));

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

  unmount();
  render(<PendingRewardDialog />);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('잔액을 못 읽어도 받은 개수는 알린다', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  rememberPendingReward({ partnerName: '축사', amount: 10 });
  getWalletMock.mockResolvedValue({ ok: false, error: { kind: 'network' } });

  render(<PendingRewardDialog />);

  expect(await screen.findByRole('dialog')).toBeInTheDocument();
  expect(screen.getByLabelText('운명의 실 보유 10개')).toBeInTheDocument();
});
