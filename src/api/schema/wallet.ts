import { z } from 'zod';

// 실(재화) 원장 — docs/api/openapi.yaml `Wallet`·`WalletCheckIn` (WKS-BE api-spec.md §12, dev adf54ab).
// 잔액은 지급·차감 내역의 합이고 화면은 계산하지 않는다(FR-31).
export const walletSchema = z.object({
  balance: z.number().int().nonnegative(),
  canCheckInToday: z.boolean(),
});

export type Wallet = z.infer<typeof walletSchema>;

// 출석 체크 — 오늘 이미 받았으면 오류가 아니라 `checkedIn: false` 로 온다.
export const walletCheckInSchema = z.object({
  checkedIn: z.boolean(),
  balance: z.number().int().nonnegative(),
});

export type WalletCheckIn = z.infer<typeof walletCheckInSchema>;
