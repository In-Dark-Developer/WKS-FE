// 화면에 보이는 문구는 한곳에 모은다 (docs/CONVENTIONS.md 7장). 말투는 '보살'.
export const shareLinkMessages = {
  button: '친구에게 공유',
  sharing: '인연을 부르는 중',
  shareText: (nickname: string) => `${nickname}님의 인연을 보았느니라. 그대와의 궁합도 보아라.`,
  copied: '링크를 복사했느니라',
  manual: '복사가 막혔느니라 — 아래 링크를 눌러 직접 가져가라',
  manualLabel: '공유 링크',
} as const;
