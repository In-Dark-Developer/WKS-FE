import { redirect, type LoaderFunctionArgs } from 'react-router-dom';

import { getCompatibilityReason } from '@/api/compatibilities';
import { readJoinedCompatibilityId } from '@/api/joinedShares';
import { readSession } from '@/api/session';

import type { Friend } from './map/tiers';
import type { ReasonView } from './reason/CompatibilityReasonSheet';
import { loadSharedResult, toOwnerFriends } from './shareMapLoader';

// SCR-24 공유 궁합 결과의 뷰 모델 — 링크 주인의 지도, 그 안에서 나와 주인의 궁합 한 줄(순위 포함),
// 그 궁합의 이유(기다리지 않고 promise — 첫 열람은 생성하느라 느리다, FR-22).
export type SharedResultView = {
  shareId: string;
  ownerNickname: string;
  friends: Friend[];
  mine: Friend;
  myRank: number;
  myResultId: string;
  reason: Promise<ReasonView>;
};

// `/s/:shareId/result` loader (09/T10, FR-6) — 이 탭에서 이 링크로 만든 궁합을 주인의 지도에서 찾는다.
// 내 결과가 없으면 공유 링크 입력으로(FR-18). 이 탭의 궁합 기록이 없거나(다른 탭·오래된 백엔드) 주인 목록에서 못 찾으면
// 이유를 열 수 없으니 전체 지도(SCR-13)로 물러난다.
export async function shareResultLoader({ params }: LoaderFunctionArgs): Promise<SharedResultView> {
  const shareId = params.shareId;
  if (!shareId) throw new Response('shareId 가 없다', { status: 404 });
  const encoded = encodeURIComponent(shareId);

  const session = readSession();
  if (!session) throw redirect(`/s/${encoded}`);

  const compatibilityId = readJoinedCompatibilityId(shareId);
  if (compatibilityId === null) throw redirect(`/s/${encoded}/map`);

  const owner = await loadSharedResult(shareId);
  const friends = toOwnerFriends(owner);
  const index = friends.findIndex((friend) => friend.compatibilityId === compatibilityId);
  const mine = friends[index];
  if (mine === undefined) throw redirect(`/s/${encoded}/map`);

  const reason = getCompatibilityReason(compatibilityId).then((outcome) => {
    if (!outcome.ok) throw new Error('궁합 이유를 불러오지 못했다');
    return outcome.data;
  });
  // 실패는 화면의 Await 가 그린다 — 여기서는 '처리되지 않은 거부' 표시만 막는다(reasonLoader 와 같다).
  reason.catch(() => undefined);

  return {
    shareId,
    ownerNickname: owner.nickname,
    friends,
    mine,
    myRank: index + 1,
    myResultId: session.resultId,
    reason,
  };
}
