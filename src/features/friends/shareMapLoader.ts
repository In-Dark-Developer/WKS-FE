import type { LoaderFunctionArgs } from 'react-router-dom';

import { writePendingShare } from '@/api/pendingShare';
import { getSharedResult } from '@/api/shares';

import type { Friend } from './map/tiers';

// SCR-06 방문자 지도의 뷰 모델 — 링크 주인의 닉네임과 친구 목록만 둔다. 주인의 운명·등급·십이간지·행운은
// 응답에 있어도 옮기지 않는다(FR-15).
export type SharedMapView = { shareId: string; nickname: string; friends: Friend[] };

// SCR-06 `/s/:shareId` loader — GET /shares/{shareId} → 링크 주인의 궁합 지도. 가드가 없다(FR-18).
// 열린 링크의 shareId 를 보관해 사주 입력을 거쳐도 궁합까지 잇는다(FR-6). 없는 링크·형식이 틀린 id 는 404,
// 그 밖의 실패는 503 을 던져 route errorElement 가 오류 화면을 그린다.
export async function shareMapLoader({ params }: LoaderFunctionArgs): Promise<SharedMapView> {
  const shareId = params.shareId;
  if (!shareId) throw new Response('shareId 가 없다', { status: 404 });

  const outcome = await getSharedResult(shareId);
  if (!outcome.ok) {
    const { error } = outcome;
    if (
      error.kind === 'api' &&
      (error.code === 'RESULT_NOT_FOUND' || error.code === 'INVALID_INPUT')
    ) {
      throw new Response(error.message, { status: 404 });
    }
    console.error('GET /shares/{shareId} 실패', error);
    throw new Response('공유 결과를 불러오지 못했다', { status: 503 });
  }

  writePendingShare(shareId);
  // `nickname` 은 링크 주인 기준의 상대 닉네임이다. 순위는 점수 높은 순, 같은 점수는 응답 순서(최근 순).
  const friends = outcome.data.compatibilities
    .map(({ nickname, score, tier }) => ({ nickname, score, tier }))
    .sort((a, b) => b.score - a.score);
  return { shareId, nickname: outcome.data.nickname, friends };
}
