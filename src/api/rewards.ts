import { z } from 'zod';

// 제휴 지급 알림(FR-32) — 로그인 응답의 `rewardGranted` 는 그 응답에서 한 번만 온다. 로그인 왕복은 전체 페이지
// 이동이라 메모리로는 살아남지 못해, 도착한 화면이 한 번 꺼내 쓰고 지우도록 sessionStorage 에 둔다.
// 탭을 닫으면 사라진다 — 못 보고 닫았다면 잔액에는 이미 들어가 있으니 모달만 놓치는 것이다.
const KEY = 'wks:pending-reward';

const pendingRewardSchema = z.object({
  partnerName: z.string(),
  amount: z.number().int().nonnegative(),
});

export type PendingReward = z.infer<typeof pendingRewardSchema>;

// 로그인 응답을 받은 쪽(api/auth.ts)이 부른다 — 지급이 없으면(null) 아무것도 남기지 않는다.
export function rememberPendingReward(reward: PendingReward | null): void {
  if (reward === null) return;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(reward));
  } catch {
    // 저장소가 막힌 브라우저에서는 모달을 건너뛴다 — 지급 자체는 백엔드가 했다.
  }
}

// 화면이 부른다 — 한 번 꺼내면 지워서 새로고침·재방문에 다시 뜨지 않게 한다.
export function takePendingReward(): PendingReward | null {
  let raw: string | null;
  try {
    raw = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
  } catch {
    return null;
  }
  if (raw === null) return null;

  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    value = null;
  }
  const parsed = pendingRewardSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}
