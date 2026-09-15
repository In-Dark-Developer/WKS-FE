import { redirect, type LoaderFunctionArgs } from 'react-router-dom';

import { markShareJoined } from '@/api/joinedShares';
import { readSession } from '@/api/session';
import { createCompatibility } from '@/api/shares';

// `/s/:shareId/join` loader — 공유 링크 입력 뒤(action)와 내 결과가 이미 있는 링크 진입이 모두 여기로 온다.
// 이 브라우저에 내 결과가 없으면 공유 링크 입력으로, 있으면 POST /shares/{shareId}/compatibility 를 부르고
// 이 탭의 궁합 기록에 남긴 뒤 친구의 궁합 지도로 보낸다(FR-6). 백엔드가 이미 있는 조합을 200 으로 주므로
// 재시도·새로고침에도 궁합이 하나다.
export async function joinShareLoader({ params }: LoaderFunctionArgs): Promise<Response> {
  const shareId = params.shareId;
  if (!shareId) throw new Response('shareId 가 없다', { status: 404 });

  const sharePath = `/s/${encodeURIComponent(shareId)}`;
  const session = readSession();
  if (!session) return redirect(sharePath);

  const outcome = await createCompatibility(shareId, session.resultId);
  if (outcome.ok) {
    markShareJoined(shareId);
    return redirect(`${sharePath}/map`);
  }

  const { error } = outcome;
  if (error.kind === 'api' && error.code === 'SELF_COMPATIBILITY') {
    // 자기 링크 — 궁합 없이 자기 결과로 간다.
    return redirect(`/reading/${session.resultId}`);
  }
  if (
    error.kind === 'api' &&
    (error.code === 'RESULT_NOT_FOUND' || error.code === 'INVALID_INPUT')
  ) {
    throw new Response(error.message, { status: 404 });
  }
  // 연결·서버 실패 — 오류 화면의 '다시 시도하기'가 입력 없이 이 loader 를 다시 부른다.
  console.error('POST /shares/{shareId}/compatibility 실패', error);
  throw new Response('궁합을 만들지 못했다', { status: 503 });
}
