import { unlockCandidateFields, type DatingUnlockField } from '@/api/unlocks';

import type { MatchCandidateView } from '../recommendation/cardsView';
import { listedCost, type UnlockItem, type UnlockOptionView } from './unlockView';

// 모달 항목 → 해금 API 항목. 모달·완료 화면의 순서(사진·이름·학과·궁합 이유)도 이 순서다.
const fieldByItem: Record<UnlockItem, DatingUnlockField> = {
  photo: 'PHOTO',
  name: 'NAME',
  department: 'DEPARTMENT',
  reason: 'REASON',
};

const itemOrder: readonly UnlockItem[] = ['photo', 'name', 'department', 'reason'];

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
  // 열린 항목 — 모달 순서대로. 해금은 전부 아니면 전무라 실패하면 비어 있다.
  opened: UnlockItem[];
  // 열린 값(백엔드 응답) — 카드를 추천 재조회 전에 바로 다시 그린다. 값이 아직 없는 항목(null)은 빠진다.
  values: Partial<Record<UnlockItem, string>>;
  // 해금 뒤 잔액(백엔드 값). 실패하면 null.
  balance: number | null;
  // 실패 이유 — 잔액 부족(402)이거나 그 밖의 실패. 열었으면 null.
  failure: 'short' | 'error' | null;
};

// 모달에서 고른 항목을 한 요청으로 연다(§10.5). 실패하면 아무것도 차감·해금되지 않는다(FR-28).
export async function unlockItems(
  candidateId: string,
  items: readonly UnlockItem[],
  unlock = unlockCandidateFields,
): Promise<UnlockRun> {
  const ordered = itemOrder.filter((each) => items.includes(each));
  const outcome = await unlock(
    candidateId,
    ordered.map((item) => fieldByItem[item]),
  );
  if (!outcome.ok) {
    const isShort = outcome.error.kind === 'api' && outcome.error.code === 'INSUFFICIENT_THREAD';
    if (!isShort) console.error('POST /dating/candidates/{id}/unlock 실패', outcome.error);
    return { opened: [], values: {}, balance: null, failure: isShort ? 'short' : 'error' };
  }
  const values: Partial<Record<UnlockItem, string>> = {};
  for (const item of ordered) {
    const value = outcome.data.values[fieldByItem[item]];
    if (typeof value === 'string') values[item] = value;
  }
  return { opened: ordered, values, balance: outcome.data.balance, failure: null };
}

// 해금 응답의 값을 카드 한 장에 얹는다 — 추천 재조회가 끝나기 전에도 연 항목이 곧바로 보이게(QA '해금 시 바로 안 바뀜').
export function applyUnlockedValues(
  candidate: MatchCandidateView,
  values: Partial<Record<UnlockItem, string>>,
): MatchCandidateView {
  const { photo, name, department, reason } = values;
  return {
    ...candidate,
    photo: photo === undefined ? candidate.photo : { isLocked: false, url: photo },
    name: name === undefined ? candidate.name : { isLocked: false, value: name },
    department:
      department === undefined ? candidate.department : { isLocked: false, value: department },
    reason: reason === undefined ? candidate.reason : { isLocked: false, value: reason },
  };
}
