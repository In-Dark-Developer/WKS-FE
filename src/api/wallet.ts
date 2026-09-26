import { request, type ApiOutcome } from './client';
import { checkInMockWallet, readMockBalance } from './me';
import { walletCheckInSchema, walletSchema, type Wallet, type WalletCheckIn } from './schema/wallet';

export type { Wallet, WalletCheckIn } from './schema/wallet';

// 재화 '실' 원장(FR-31) — 잔액의 단일 출처다. `/me` 의 threadBalance 는 진입 게이트용 요약이라
// 화면 잔액은 여기서 읽는다. 인증 필요(세션 쿠키). `VITE_API_MOCK=true` 면 목 계정의 잔액을 쓴다.
const isMockEnabled = () => import.meta.env.VITE_API_MOCK === 'true';

// GET /wallet — 잔액과 오늘 출석 가능 여부.
export async function getWallet(): Promise<ApiOutcome<Wallet>> {
  if (isMockEnabled()) return { ok: true, data: readMockBalance() };
  return request({ method: 'GET', path: '/wallet' }, walletSchema);
}

// POST /wallet/check-in — 출석 +5(KST 하루 1회). 이미 받은 날이면 `checkedIn: false` 로 200 이 온다.
export async function checkInWallet(): Promise<ApiOutcome<WalletCheckIn>> {
  if (isMockEnabled()) return { ok: true, data: checkInMockWallet() };
  return request({ method: 'POST', path: '/wallet/check-in' }, walletCheckInSchema);
}
