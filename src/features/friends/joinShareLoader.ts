import { redirect, type LoaderFunctionArgs } from 'react-router-dom';

import { clearPendingShare, writePendingShare } from '@/api/pendingShare';
import { readSession } from '@/api/session';
import { createCompatibility } from '@/api/shares';

// `/s/:shareId/join` loader — SCR-06 '내 사주 내용도 확인하기'와 사주 입력 뒤(sajuAction)가 모두 여기로 온다.
// 이 브라우저에 내 결과가 없으면 사주 입력(`/`)으로, 있으면 POST /shares/{shareId}/compatibility 를 부르고
// 내 결과로 보낸다(FR-6). 백엔드가 이미 있는 조합을 200 으로 주므로 재시도·새로고침에도 궁합이 하나다.
export async function joinShareLoader({ params }: LoaderFunctionArgs): Promise<Response> {
  const shareId = params.shareId;
  if (!shareId) throw new Response('shareId 가 없다', { status: 404 });

  const session = readSession();
  if (!session) {
    // 링크 화면을 거치지 않고 이 주소로 바로 와도 사주 입력 뒤 궁합까지 잇는다.
    writePendingShare(shareId);
    return redirect('/');
  }

  const outcome = await createCompatibility(shareId, session.resultId);
  if (outcome.ok) {
    clearPendingShare();
    return redirect(`/reading/${session.resultId}`);
  }

  const { error } = outcome;
  if (error.kind === 'api' && error.code === 'SELF_COMPATIBILITY') {
    // 자기 링크 — 궁합 없이 자기 결과로 간다.
    clearPendingShare();
    return redirect(`/reading/${session.resultId}`);
  }
  if (
    error.kind === 'api' &&
    (error.code === 'RESULT_NOT_FOUND' || error.code === 'INVALID_INPUT')
  ) {
    clearPendingShare();
    throw new Response(error.message, { status: 404 });
  }
  // 연결·서버 실패는 보관한 shareId 를 남긴다 — 오류 화면의 '다시 시도'가 입력 없이 이 loader 를 다시 부른다.
  console.error('POST /shares/{shareId}/compatibility 실패', error);
  throw new Response('궁합을 만들지 못했다', { status: 503 });
}
