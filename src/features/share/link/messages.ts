// 화면에 보이는 문구는 한곳에 모은다 (docs/CONVENTIONS.md 7장). 말투는 '보살'.
export const shareLinkMessages = {
  button: '친구에게 공유',
  sharing: '인연을 부르는 중',
  // 공유 시트 본문 — QA(2026-09-28) 요청 문구. 링크 주인 닉네임은 넣지 않는다.
  shareText: '부처님이 우리를 어떻게 이어놨는지 궁금하면 지금 등록해봐!',
  copied: '링크를 복사했느니라',
  manual: '복사가 막혔느니라 — 아래 링크를 눌러 직접 가져가라',
  manualLabel: '공유 링크',
} as const;
