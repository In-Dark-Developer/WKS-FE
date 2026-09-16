// FR-4 '친구에게 공유' 의 3단 폴백. 어느 단계까지 갔는지를 결과로 돌려주고,
// 무엇을 보여줄지(Toast · 링크 노출)는 부르는 쪽이 정한다 — 분기를 테스트하기 쉽게 나눈 것이다.
export type ShareOutcome =
  // OS 공유 시트로 넘겼다
  | 'shared'
  // 사용자가 공유 시트를 직접 닫았다 — 실패가 아니므로 아무것도 하지 않는다
  | 'cancelled'
  // 공유 시트가 없거나 실패해서 클립보드에 복사했다
  | 'copied'
  // 복사도 막혀서 링크를 직접 고르게 보여줘야 한다
  | 'manual';

type ShareMeta = {
  title: string;
  text: string;
};

function isAbortError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null || !('name' in error)) return false;
  return error.name === 'AbortError';
}

async function copyToClipboard(url: string): Promise<boolean> {
  if (typeof navigator.clipboard?.writeText !== 'function') return false;
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    // 권한 거부·비보안 컨텍스트 — 마지막 단계로 넘긴다.
    return false;
  }
}

export async function shareLink(url: string, meta: ShareMeta): Promise<ShareOutcome> {
  if (typeof navigator.share === 'function') {
    try {
      // title·url 을 따로 넘기면 받는 앱(카카오톡 등)이 title·text·url 을 구분자 없이 이어 붙인다
      // ('운명도 꿰어야 사랑이다최선우님의…', 링크가 문구까지 먹는 것). 셋을 text 한 곳에 줄바꿈으로 넣는다.
      await navigator.share({ text: `${meta.title}\n${meta.text}\n${url}` });
      return 'shared';
    } catch (error) {
      if (isAbortError(error)) return 'cancelled';
      // 그 밖의 실패(지원하지 않는 데이터 등)는 복사로 이어 간다.
    }
  }
  return (await copyToClipboard(url)) ? 'copied' : 'manual';
}
