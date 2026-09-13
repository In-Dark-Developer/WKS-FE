// 공유 링크는 코드에 절대 주소를 쓰지 않고 지금 열려 있는 origin 으로 만든다
// (공지 2026-09-13-hosting-domains). 배포 주소가 바뀌어도 화면은 그대로다.
export function buildShareUrl(shareId: string): string {
  return new URL(`/s/${encodeURIComponent(shareId)}`, window.location.origin).toString();
}
