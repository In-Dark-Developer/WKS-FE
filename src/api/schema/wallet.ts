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

// 제휴 유입 보상 — 이미 로그인한 사람이 제휴 링크로 들어왔을 때. 이미 받았거나 모르는 코드면 오류가 아니라
// `rewardGranted: null` 로 온다(WKS-BE api-spec.md §12, dev bfe89e3).
export const partnerRewardSchema = z.object({
  rewardGranted: z
    .object({ partnerName: z.string(), amount: z.number().int().nonnegative() })
    .nullable(),
  balance: z.number().int().nonnegative(),
});

export type PartnerReward = z.infer<typeof partnerRewardSchema>;
