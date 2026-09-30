import { rememberPendingReward } from '@/api/rewards';
import { claimPartnerReward } from '@/api/wallet';

// 제휴 링크(`?ref=FESTIVAL`)의 코드를 로그인까지 들고 간다(FR-32). 탭을 닫았다 다시 열거나 다른 탭에서 로그인해도
// 받도록 localStorage 에 둔다(QA 2026-09-30) — 백엔드가 계정당 코드별 1회만 주므로 오래 남아도 중복 지급은 없다.
// 인앱 브라우저에서 외부 브라우저로 넘어가면 저장소는 비지만 주소에 ref 가 남아 다시 읽힌다.
const KEY = 'wks:partner-ref';
const MAX_LENGTH = 100; // WKS-BE §12 — 100자 이하
// 배너 진입 안내(SCR-23 1.1)를 이 탭에서 이미 띄웠는지 — 넘긴 뒤 화면을 옮길 때마다 다시 뜨지 않게 한다.
// ref 와 달리 탭 단위(sessionStorage)다.
const SEEN_KEY = 'wks:partner-entry-seen';

// 진입 주소에 ref 가 있으면 보관한다. 없으면 이전에 보관한 값을 그대로 둔다(링크로 들어와 다른 화면에서 로그인하는 경우).
export function capturePartnerRef(search: string): void {
  const ref = new URLSearchParams(search).get('ref')?.trim();
  if (!ref || ref.length > MAX_LENGTH) return;
  try {
    localStorage.setItem(KEY, ref);
  } catch {
    // 저장소가 막힌 브라우저에서는 보상 없이 로그인한다.
  }
}

export function readPartnerRef(): string | null {
  try {
    return localStorage.getItem(KEY);
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
    localStorage.removeItem(KEY);
  } catch {
    // 지우지 못해도 백엔드가 계정당 코드별 1회만 준다.
  }
}

// 이미 로그인한 채 제휴 링크로 들어왔으면 지금 받는다. 지우는 것은 받았거나(이미 받았거나 모르는 코드여도 성공으로 온다)
// 백엔드가 값 자체를 거절했을 때(INVALID_INPUT)뿐이다. 비로그인(401)이면 로그인 요청이 싣고, 서버 오류(500)·연결·스키마
// 실패는 남겨 두어 다음 진입에 다시 한다 — ApiFailure 에 HTTP 상태가 없어 코드로 가른다(QA 2026-09-30).
// 지급됐으면 소개팅 화면이 모달로 알린다(PendingRewardDialog).
export async function claimPendingPartnerRef(): Promise<void> {
  const ref = readPartnerRef();
  if (ref === null) return;
  const outcome = await claimPartnerReward(ref);
  if (outcome.ok) {
    clearPartnerRef();
    rememberPendingReward(outcome.data.rewardGranted);
    return;
  }
  if (outcome.error.kind === 'api' && outcome.error.code === 'INVALID_INPUT') clearPartnerRef();
}
