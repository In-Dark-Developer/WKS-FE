// 카카오 로그인 시작 URL 을 만들고 CSRF 방지용 state 를 오간다(ADR-20260922-kakao-login-and-jwt-session).
// state 는 sessionStorage 에 둔다 — 탭을 닫으면 사라지는 게 맞다(인가 왕복은 같은 탭 안에서 끝난다).
const STATE_KEY = 'wks:kakao-oauth-state';

// redirectUri 는 백엔드 app.auth.allowed-redirect-uris 화이트리스트와 정확히 같아야 한다
// (문자 그대로 일치, 접두사·와일드카드 없음 — 백엔드 architecture.md §4).
export function buildKakaoAuthorizeUrl(redirectUri: string): string {
  const clientId = import.meta.env.VITE_KAKAO_CLIENT_ID;
  if (!clientId) {
    throw new Error('VITE_KAKAO_CLIENT_ID 가 설정되지 않았다');
  }

  const state = crypto.randomUUID();
  try {
    sessionStorage.setItem(STATE_KEY, state);
  } catch {
    // 저장하지 못해도 로그인 시도 자체는 막지 않는다 — 콜백에서 state 검증이 실패로 처리된다.
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    state,
  });
  return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
}

// 콜백 화면에서 쿼리의 state 가 저장해 둔 값과 같은지 확인한다. 결과와 무관하게 한 번 쓰고 지운다
// (재사용 방지 — 같은 콜백 주소를 다시 열어도 두 번째는 항상 실패한다).
export function consumeKakaoState(receivedState: string | null): boolean {
  let saved: string | null;
  try {
    saved = sessionStorage.getItem(STATE_KEY);
    sessionStorage.removeItem(STATE_KEY);
  } catch {
    return false; // 스토리지를 못 쓰면 검증할 수 없으니 안전하게 실패로 본다
  }
  return saved !== null && receivedState !== null && saved === receivedState;
}
