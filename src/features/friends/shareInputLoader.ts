import type { LoaderFunctionArgs } from 'react-router-dom';

import { hasJoinedShare } from '@/api/joinedShares';
import { readSession } from '@/api/session';

import { loadSharedResult } from './shareMapLoader';

// SCR-06 공유 링크 입력의 뷰 모델 — 부제에 넣을 링크 주인 닉네임(FR-15)과, 이 브라우저의 사주로 궁합을 만들 수 있는지.
// `canReusePrevious` 면 입력 전에 '이전 정보 불러오기 / 새로 작성하기'를 고르게 한다(FR-23).
export type ShareInputView = { ownerNickname: string; canReusePrevious: boolean };

// SCR-06 `/s/:shareId` loader — 가드가 없다(FR-18). 이 브라우저에 내 결과가 있고 이 탭에서 이 링크로 궁합을 만든
// 적이 없으면 고르게 한다 — 궁합은 '이전 정보 불러오기'가 `/s/:shareId/join` 에서 만든다(FR-23). 지도에서 뒤로
// 돌아온 입력은 고르지 않고 폼을 보인다(FR-6). 없는 링크는 404, 그 밖의 실패는 503(loadSharedResult).
export async function shareInputLoader({ params }: LoaderFunctionArgs): Promise<ShareInputView> {
  const shareId = params.shareId;
  if (!shareId) throw new Response('shareId 가 없다', { status: 404 });

  const owner = await loadSharedResult(shareId);
  const canReusePrevious = readSession() !== null && !hasJoinedShare(shareId);
  return { ownerNickname: owner.nickname, canReusePrevious };
}
