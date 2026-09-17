// 카카오톡 인앱 브라우저는 저장소가 기본 브라우저와 따로라 여기서 만든 '내 결과'가 Safari·Chrome 으로 넘어가지 않는다
// (ADR-20260914-result-ownership-in-browser). 카카오톡이면 외부 브라우저로 여는 스킴 주소를 돌려준다 — 아니면 null.
// 인스타그램 인앱은 같은 스킴이 없어 넘기지 않는다.
export function kakaoTalkExternalUrl(userAgent: string, href: string): string | null {
  if (!/KAKAOTALK/i.test(userAgent)) return null;
  return `kakaotalk://web/openExternal?url=${encodeURIComponent(href)}`;
}
