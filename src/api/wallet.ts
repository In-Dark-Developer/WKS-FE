import { request, type ApiOutcome } from './client';
import { checkInMockWallet, readMockBalance } from './me';
import {
  walletCheckInSchema,
  walletSchema,
  type Wallet,
  type WalletCheckIn,
} from './schema/wallet';

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

// 사이트 접속 때 출석을 자동으로 받는다(2026-09-27 결정 — 재화 안내 모달의 '출석 체크'). 페이지를 연 동안 한 번만
// 부르고, 소개팅 잔액을 읽는 쪽은 이것을 기다린 뒤 읽는다. 비로그인(401)·실패면 다음 호출에서 다시 한다.
let dailyCheckIn: Promise<void> | null = null;

export function ensureDailyCheckIn(): Promise<void> {
  dailyCheckIn ??= checkInWallet().then((outcome) => {
    if (!outcome.ok) dailyCheckIn = null;
  });
  return dailyCheckIn;
}

// 테스트용 — 페이지를 새로 연 것처럼 되돌린다.
export function resetDailyCheckIn(): void {
  dailyCheckIn = null;
}
