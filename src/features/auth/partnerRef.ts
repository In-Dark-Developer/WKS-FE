import { isUnauthenticated } from '@/api/me';
import { rememberPendingReward } from '@/api/rewards';
import { claimPartnerReward } from '@/api/wallet';

// 제휴 링크(`?ref=FESTIVAL`)의 코드를 로그인까지 들고 간다(FR-32). 카카오 왕복은 같은 탭의 전체 페이지 이동이라
// sessionStorage 에 둔다. 인앱 브라우저에서 외부 브라우저로 넘어가면 저장소는 비지만 주소에 ref 가 남아 다시 읽힌다.
const KEY = 'wks:partner-ref';
const MAX_LENGTH = 100; // WKS-BE §12 — 100자 이하

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

export function clearPartnerRef(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // 지우지 못해도 백엔드가 계정당 코드별 1회만 준다.
  }
}

// 이미 로그인한 채 제휴 링크로 들어왔으면 지금 받는다. 비로그인(401)이면 남겨 두고 로그인 요청이 싣는다.
// 연결 실패도 남겨 두어 다음 진입에 다시 한다. 지급됐으면 소개팅 화면이 모달로 알린다(PendingRewardDialog).
export async function claimPendingPartnerRef(): Promise<void> {
  const ref = readPartnerRef();
  if (ref === null) return;
  const outcome = await claimPartnerReward(ref);
  if (outcome.ok) {
    clearPartnerRef();
    rememberPendingReward(outcome.data.rewardGranted);
    return;
  }
  if (outcome.error.kind === 'api' && !isUnauthenticated(outcome)) clearPartnerRef();
}
