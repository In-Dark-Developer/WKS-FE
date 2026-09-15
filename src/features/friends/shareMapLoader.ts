import { redirect, type LoaderFunctionArgs } from 'react-router-dom';

import type { SharedResult } from '@/api/schema/share';
import { readSession } from '@/api/session';
import { getSharedResult } from '@/api/shares';

import type { Friend } from './map/tiers';

// SCR-13 친구의 궁합 지도 뷰 모델 — 링크 주인의 닉네임·친구 목록과 '내 사주 내용도 확인하기'가 갈 내 resultId.
// 주인의 운명·등급·십이간지·행운은 응답에 있어도 옮기지 않는다(FR-15).
export type SharedMapView = {
  shareId: string;
  nickname: string;
  friends: Friend[];
  myResultId: string;
};

// GET /shares/{shareId} — 없는 링크·형식이 틀린 id 는 404, 그 밖의 실패는 503 을 던져 route errorElement 가
// 오류 화면을 그린다. 공유 링크 입력·지도 loader 가 함께 쓴다.
export async function loadSharedResult(shareId: string): Promise<SharedResult> {
  const outcome = await getSharedResult(shareId);
  if (outcome.ok) return outcome.data;

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

// SCR-13 `/s/:shareId/map` loader — 이 브라우저에 내 결과가 없으면 공유 링크 입력으로 보내고(FR-18), 있으면
// 링크 주인의 궁합 지도를 다시 불러 새로고침에도 같은 지도를 보인다(FR-6).
export async function shareMapLoader({ params }: LoaderFunctionArgs): Promise<SharedMapView> {
  const shareId = params.shareId;
  if (!shareId) throw new Response('shareId 가 없다', { status: 404 });

  const session = readSession();
  if (!session) throw redirect(`/s/${encodeURIComponent(shareId)}`);

  const owner = await loadSharedResult(shareId);
  // `nickname` 은 링크 주인 기준의 상대 닉네임이다. 순위는 점수 높은 순, 같은 점수는 응답 순서(최근 순).
  const friends = owner.compatibilities
    .map(({ nickname, score, tier }) => ({ nickname, score, tier }))
    .sort((a, b) => b.score - a.score);
  return { shareId, nickname: owner.nickname, friends, myResultId: session.resultId };
}
