import { unlockCandidateField, type DatingUnlockField } from '@/api/unlocks';

import type { MatchCandidateView } from '../recommendation/cardsView';
import type { UnlockItem, UnlockOptionView } from './unlockView';

// 모달 항목 → 해금 API 항목. 모달·완료 화면의 순서(사진·이름·학과·궁합 이유)도 이 순서다.
const fieldByItem: Record<UnlockItem, DatingUnlockField> = {
  photo: 'PHOTO',
  name: 'NAME',
  department: 'DEPARTMENT',
  reason: 'REASON',
};

const itemOrder: readonly UnlockItem[] = ['photo', 'name', 'department', 'reason'];

// 이미 연 항목의 비용 표시용 — 응답은 연 항목의 비용을 주지 않는다(§10.4). 모달은 연 칸에도 비용을
// 적은 채 비활성으로 둔다(Figma 112:3342). 차감 판단에는 쓰지 않는다 — 차감은 백엔드가 한다.
const listedCost: Record<UnlockItem, number> = { photo: 10, name: 7, department: 5, reason: 3 };

// 카드 한 장의 해금 모달 칸 — 잠긴 항목은 백엔드 비용, 연 항목은 비활성.
export function toUnlockOptions(candidate: MatchCandidateView): UnlockOptionView[] {
  return itemOrder.map((item) => {
    const field = candidate[item];
    return field.isLocked
      ? { item, cost: field.cost, isUnlocked: false }
      : { item, cost: listedCost[item], isUnlocked: true };
  });
}

export type UnlockRun = {
  // 열린 항목 — 모달 순서대로.
  opened: UnlockItem[];
  // 마지막으로 성공한 해금 뒤 잔액(백엔드 값). 하나도 못 열었으면 null.
  balance: number | null;
  // 멈춘 이유 — 잔액 부족(402)이거나 그 밖의 실패. 다 열었으면 null.
  failure: 'short' | 'error' | null;
};

// 모달에서 고른 항목을 하나씩 연다 — 백엔드 해금은 한 번에 한 항목이다(§10.5). 실패하면 거기서 멈춘다:
// 그 항목은 차감되지 않고 잠긴 채이며(FR-28), 앞서 연 항목은 이미 열렸다.
export async function unlockItems(
  candidateId: string,
  items: readonly UnlockItem[],
  unlock = unlockCandidateField,
): Promise<UnlockRun> {
  const run: UnlockRun = { opened: [], balance: null, failure: null };
  for (const item of itemOrder.filter((each) => items.includes(each))) {
    const outcome = await unlock(candidateId, fieldByItem[item]);
    if (!outcome.ok) {
      const isShort = outcome.error.kind === 'api' && outcome.error.code === 'INSUFFICIENT_THREAD';
      if (!isShort) console.error('POST /dating/candidates/{id}/unlock 실패', outcome.error);
      run.failure = isShort ? 'short' : 'error';
      return run;
    }
    run.opened.push(item);
    run.balance = outcome.data.balance;
  }
  return run;
}
