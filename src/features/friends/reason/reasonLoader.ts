import { redirect, type LoaderFunctionArgs } from 'react-router-dom';

import { getCompatibilityReason } from '@/api/compatibilities';

import type { ReasonView } from './CompatibilityReasonSheet';

export type ReasonLoaderData = { compatibilityId: number; reason: Promise<ReasonView> };

// `/me/map/:friendId` — 이유는 기다리지 않고 promise 로 넘긴다. 첫 열람은 백엔드가 생성하느라 느려서(최대 30초)
// 시트를 먼저 띄우고 그 안에서 로딩을 보여야 한다(FR-22). 실패는 promise 가 거부되어 시트가 오류를 그린다.
export function compatibilityReasonLoader({ params }: LoaderFunctionArgs): ReasonLoaderData {
  const compatibilityId = Number(params.friendId);
  if (!Number.isInteger(compatibilityId) || compatibilityId <= 0) throw redirect('/me/map');
  const reason = getCompatibilityReason(compatibilityId).then((outcome) => {
    if (!outcome.ok) throw new Error('궁합 이유를 불러오지 못했다');
    return outcome.data;
  });
  // 실패는 시트의 Await 가 그린다. 다만 시트를 그리지 않는 길(목록에 없는 ID → 지도로)에서는 아무도 이 promise 를
  // 받지 않아 '처리되지 않은 거부'가 된다 — 빈 catch 로 처리됨 표시만 하고, Await 에는 원래 promise 를 그대로 넘긴다.
  reason.catch(() => undefined);
  return { compatibilityId, reason };
}
