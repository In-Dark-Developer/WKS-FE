import { redirect, type LoaderFunctionArgs } from 'react-router-dom';

import { hasJoinedShare } from '@/api/joinedShares';
import { readSession } from '@/api/session';

import { loadSharedResult } from './shareMapLoader';

// SCR-06 공유 링크 입력의 뷰 모델 — 부제에 넣을 링크 주인 닉네임만 둔다(FR-15).
export type ShareInputView = { ownerNickname: string };

// SCR-06 `/s/:shareId` loader — 가드가 없다(FR-18). 이 브라우저에 내 결과가 있고 이 탭에서 이 링크로 궁합을 만든
// 적이 없으면 입력 없이 궁합 생성(`/s/:shareId/join`)으로 보낸다. 지도에서 뒤로 돌아온 입력은 폼을 보인다(FR-6).
// 없는 링크는 404, 그 밖의 실패는 503(loadSharedResult).
export async function shareInputLoader({ params }: LoaderFunctionArgs): Promise<ShareInputView> {
  const shareId = params.shareId;
  if (!shareId) throw new Response('shareId 가 없다', { status: 404 });

  if (readSession() && !hasJoinedShare(shareId)) {
    throw redirect(`/s/${encodeURIComponent(shareId)}/join`);
  }

  const owner = await loadSharedResult(shareId);
  return { ownerNickname: owner.nickname };
}
