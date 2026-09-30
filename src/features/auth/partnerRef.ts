import { isUnauthenticated } from '@/api/me';
import { rememberPendingReward } from '@/api/rewards';
import { claimPartnerReward } from '@/api/wallet';

// 제휴 링크(`?ref=FESTIVAL`)의 코드를 로그인까지 들고 간다(FR-32). 카카오 왕복은 같은 탭의 전체 페이지 이동이라
// sessionStorage 에 둔다. 인앱 브라우저에서 외부 브라우저로 넘어가면 저장소는 비지만 주소에 ref 가 남아 다시 읽힌다.
const KEY = 'wks:partner-ref';
const MAX_LENGTH = 100; // WKS-BE §12 — 100자 이하
// 배너 진입 안내(SCR-23 1.1)를 이 탭에서 이미 띄웠는지 — 넘긴 뒤 화면을 옮길 때마다 다시 뜨지 않게 한다.
const SEEN_KEY = 'wks:partner-entry-seen';

// 진입 주소에 ref 가 있으면 보관한다. 없으면 이전에 보관한 값을 그대로 둔다(링크로 들어와 다른 화면에서 로그인하는 경우).
export function capturePartnerRef(search: string): void {
  const ref = new URLSearchParams(search).get('ref')?.trim();
  if (!ref || ref.length > MAX_LENGTH) return;
  try {
    sessionStorage.setItem(KEY, ref);
  } catch {
    // 저장소가 막힌 브라우저에서는 보상 없이 로그인한다.
  }
}

export function readPartnerRef(): string | null {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

// 아직 받지 못한 제휴 코드를 들고 있는지 — 로그인 전 안내 모달을 띄울지 정하는 데 쓴다(FR-32).
export function hasPartnerRef(): boolean {
  return readPartnerRef() !== null;
}

export function markPartnerEntrySeen(): void {
  try {
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    // 남기지 못하면 안내가 한 번 더 뜬다 — 지급에는 영향이 없다.
  }
}

export function wasPartnerEntrySeen(): boolean {
  try {
    return sessionStorage.getItem(SEEN_KEY) !== null;
  } catch {
    return false;
  }
}

export function clearPartnerRef(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // 지우지 못해도 백엔드가 계정당 코드별 1회만 준다.
  }
}

// 이미 로그인한 채 제휴 링크로 들어왔으면 지금 받는다. 비로그인(401)이면 남겨 두고 로그인 요청이 싣는다.
// 연결 실패·서버 오류(500)도 남겨 두어 다음 진입에 다시 한다 — 지우면 그 탭에서는 다시 받을 길이 없다(2026-09-30 QA).
// 지급을 남겼으면 true — 알림 모달(PendingRewardDialog)은 이 응답보다 먼저 떠 있으므로 부른 쪽이 다시 읽게 한다.
export async function claimPendingPartnerRef(): Promise<boolean> {
  const ref = readPartnerRef();
  if (ref === null) return false;
  const outcome = await claimPartnerReward(ref);
  if (outcome.ok) {
    clearPartnerRef();
    rememberPendingReward(outcome.data.rewardGranted);
    return outcome.data.rewardGranted !== null;
  }
  const isRetryable =
    outcome.error.kind !== 'api' ||
    isUnauthenticated(outcome) ||
    outcome.error.code === 'INTERNAL_ERROR';
  if (!isRetryable) clearPartnerRef();
  return false;
}
