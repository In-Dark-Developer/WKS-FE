import { replace, type LoaderFunctionArgs } from 'react-router-dom';

import { markShareJoined } from '@/api/joinedShares';
import { forgetSession, readSession } from '@/api/session';
import { createCompatibility, getSharedResult } from '@/api/shares';
import { track } from '@/lib/analytics';

// 공유 링크 궁합 생성 — POST /shares/{shareId}/compatibility 뒤 갈 곳을 돌려준다(FR-6). 궁합을 만들면 이 탭의 기록에
// 남기고 친구의 궁합 지도로, 자기 링크면 내 결과로 간다. 없는 링크는 404 를 던지고, 연결·서버 실패는 null 이다 —
// 부르는 쪽이 재시도 화면(`/s/:shareId/join`)으로 보낸다. 백엔드가 이미 있는 조합을 200 으로 주므로 재시도에도 궁합이 하나다.
// RESULT_NOT_FOUND 는 링크 주인이 없을 때와 내 결과가 없을 때 같은 코드다(백엔드 CompatibilityService) — 링크를
// 다시 조회해 링크가 살아 있으면 내 결과가 죽은 것이므로 보관된 '내 결과'를 비우고 사주 입력(SCR-06)으로 보낸다.
export async function joinShare(shareId: string, resultId: string): Promise<string | null> {
  const outcome = await createCompatibility(shareId, resultId);
  if (outcome.ok) {
    markShareJoined(shareId);
    track('compatibility_created', {});
    return `/s/${encodeURIComponent(shareId)}/map`;
  }

  const { error } = outcome;
  if (error.kind === 'api' && error.code === 'SELF_COMPATIBILITY') return `/reading/${resultId}`;
  if (error.kind === 'api' && error.code === 'RESULT_NOT_FOUND') {
    const owner = await getSharedResult(shareId);
    if (owner.ok) {
      forgetSession(resultId);
      return `/s/${encodeURIComponent(shareId)}`;
    }
    // 링크도 조회되지 않으면 없는 링크다. 조회가 연결 문제로 실패하면 어느 쪽인지 모르므로 세션을 두고 재시도로 보낸다.
    if (owner.error.kind === 'api') throw new Response(error.message, { status: 404 });
    console.error('GET /shares/{shareId} 실패', owner.error);
    return null;
  }
  if (error.kind === 'api' && error.code === 'INVALID_INPUT') {
    throw new Response(error.message, { status: 404 });
  }
  console.error('POST /shares/{shareId}/compatibility 실패', error);
  return null;
}

// `/s/:shareId/join` loader — 궁합 생성이 실패했을 때의 재시도 주소다. 내 결과가 없으면 공유 링크 입력으로, 있으면
// 궁합을 다시 만들어 보내고, 또 실패하면 503 을 던져 '다시 시도하기' 오류를 그린다. 이동은 replace — 이 주소가
// 방문 기록에 남으면 지도에서 뒤로가기가 여기로 와 다시 지도로 튕긴다.
export async function joinShareLoader({ params }: LoaderFunctionArgs): Promise<Response> {
  const shareId = params.shareId;
  if (!shareId) throw new Response('shareId 가 없다', { status: 404 });

  const session = readSession();
  if (!session) return replace(`/s/${encodeURIComponent(shareId)}`);

  const next = await joinShare(shareId, session.resultId);
  if (next === null) throw new Response('궁합을 만들지 못했다', { status: 503 });
  return replace(next);
}
