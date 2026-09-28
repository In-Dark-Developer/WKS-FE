// 화면에 보이는 문구는 한곳에 모은다 (docs/CONVENTIONS.md 7장). 말투는 '보살'.
export const shareLinkMessages = {
  button: '친구에게 공유',
  sharing: '인연을 부르는 중',
  // QA 3차(2026-09-28) 문구 — 링크는 공유 시 다음 줄에 붙는다(shareLink.ts).
  shareText: '부처님이 우리를 어떻게 이어놨는지 궁금하면 지금 등록해봐!',
  copied: '링크를 복사했느니라',
  manual: '복사가 막혔느니라 — 아래 링크를 눌러 직접 가져가라',
  manualLabel: '공유 링크',
} as const;
