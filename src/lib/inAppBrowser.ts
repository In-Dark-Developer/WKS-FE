// 인앱 브라우저는 저장소가 기본 브라우저와 따로라 여기서 만든 '내 결과'가 Safari·Chrome 으로 넘어가지 않고, 기본 브라우저에서
// 만든 결과로 자기 링크를 열어도 다시 사주를 입력하게 된다(ADR-20260914-result-ownership-in-browser).
// 인앱이면 기본 브라우저로 여는 주소를 돌려준다 — 아니면 null.
export function externalBrowserUrl(userAgent: string, href: string): string | null {
  if (/KAKAOTALK/i.test(userAgent)) {
    return `kakaotalk://web/openExternal?url=${encodeURIComponent(href)}`;
  }
  if (!/Instagram/i.test(userAgent)) return null;

  // 인스타그램은 외부 브라우저 스킴이 없어 OS 스킴을 쓴다. Android 는 Chrome intent — intent 주소가 `#Intent` 로 끝나므로
  // 원래 주소의 해시는 뺀다(라우팅은 경로만 쓴다). fallback 주소를 두면 인앱에서 다시 열려 이동이 반복되므로 두지 않는다.
  if (/Android/i.test(userAgent)) {
    const url = new URL(href);
    return `intent://${url.host}${url.pathname}${url.search}#Intent;scheme=${url.protocol.slice(0, -1)};package=com.android.chrome;end`;
  }
  // iOS 는 Safari 스킴(iOS 17 이상). 모르는 버전이면 이동이 없고 앱이 그대로 뜬다.
  if (/iPhone|iPad|iPod/i.test(userAgent)) return `x-safari-${href}`;
  return null;
}
