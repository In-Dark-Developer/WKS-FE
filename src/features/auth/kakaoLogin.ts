import { z } from 'zod';

import { loginWithKakao } from '@/api/auth';
import type { ApiFailure } from '@/api/client';
import { readSession } from '@/api/session';

// 카카오 로그인 왕복 — 인가 화면으로 전체 페이지 이동(팝업 아님, 인앱 브라우저에서도 동작)했다가 콜백 경로로 돌아와
// 인가 코드를 백엔드에 넘긴다. 세션은 백엔드가 쿠키로 심으므로 여기서는 토큰을 다루지 않는다(openapi `/auth/kakao`).
// `Feat/Login`(b226363)의 인가 URL·state 검증을 옮기고 토큰 저장을 뺐다.

export const KAKAO_CALLBACK_PATH = '/auth/kakao/callback';

// CSRF 방지 state 와 로그인을 시작한 화면을 함께 둔다. 인가 왕복은 같은 탭에서 끝나므로 sessionStorage 다.
const PENDING_KEY = 'wks:kakao-login';

// 복귀 경로는 같은 origin 의 절대 경로만 받는다 — `//evil.com` 같은 외부 이동을 막는다.
const returnToSchema = z
  .string()
  .regex(/^\/(?![/\\])/)
  .catch('/');
const pendingSchema = z.object({ state: z.string().min(1), returnTo: returnToSchema });

const isMockEnabled = () => import.meta.env.VITE_API_MOCK === 'true';

function callbackUri(): string {
  return `${window.location.origin}${KAKAO_CALLBACK_PATH}`;
}

// 로그인을 시작할 URL 을 만든다. 호출자가 그 URL 로 전체 페이지 이동한다. returnTo 는 로그인 뒤 돌아올 화면이다.
// 목 모드에서는 카카오를 거치지 않고 가짜 코드로 콜백 경로에 바로 간다 — 콜백 처리 흐름은 실제와 같다.
export function startKakaoLogin(returnTo: string): string {
  const state = crypto.randomUUID();
  try {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify({ state, returnTo }));
  } catch {
    // 저장하지 못해도 시작은 막지 않는다 — 콜백의 state 검증이 실패로 처리한다.
  }

  if (isMockEnabled()) {
    return `${KAKAO_CALLBACK_PATH}?${new URLSearchParams({ code: 'mock-code', state }).toString()}`;
  }

  const clientId = import.meta.env.VITE_KAKAO_CLIENT_ID;
  if (!clientId) throw new Error('VITE_KAKAO_CLIENT_ID 가 설정되지 않았다');
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUri(),
    response_type: 'code',
    state,
  });
  return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
}

// 로그인 시트의 '카카오로 시작하기' — returnTo 를 복귀 지점으로 카카오 인가로 전체 페이지 이동한다.
export function goToKakaoLogin(returnTo: string): void {
  try {
    window.location.assign(startKakaoLogin(returnTo));
  } catch (error) {
    // VITE_KAKAO_CLIENT_ID 미설정 — 시트는 그대로 두고 원인만 남긴다.
    console.error('카카오 로그인을 시작하지 못했다', error);
  }
}

// 저장해 둔 state 가 받은 값과 같으면 복귀 경로를 돌려준다. 결과와 무관하게 한 번 쓰고 지운다(재사용 방지).
function consumePending(receivedState: string | null): { returnTo: string } | null {
  let raw: string | null;
  try {
    raw = sessionStorage.getItem(PENDING_KEY);
    sessionStorage.removeItem(PENDING_KEY);
  } catch {
    return null;
  }
  if (raw === null || receivedState === null) return null;
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }
  const parsed = pendingSchema.safeParse(value);
  if (!parsed.success || parsed.data.state !== receivedState) return null;
  return { returnTo: parsed.data.returnTo };
}

export type KakaoLoginOutcome =
  | { kind: 'success'; restoredResultId: string | null }
  | { kind: 'kakao-error'; error: string } // 카카오가 ?error= 로 돌려보냈다(사용자 취소 등)
  | { kind: 'state-mismatch' } // 다른 곳에서 시작됐거나 콜백을 다시 열었다
  | { kind: 'missing-code' }
  | { kind: 'api-error'; error: ApiFailure };

// 콜백 경로의 쿼리로 로그인을 마친다. 성공·실패와 무관하게 돌아갈 화면(returnTo)을 함께 준다 — 취소·실패해도
// 시작한 화면으로 돌아가고 비로그인 기록은 그대로 남는다(FR-21). 이 브라우저의 resultId 가 있으면 함께 보내
// 백엔드가 계정에 연결·복원한다.
export async function completeKakaoLogin(
  searchParams: URLSearchParams,
): Promise<{ returnTo: string; outcome: KakaoLoginOutcome }> {
  const pending = consumePending(searchParams.get('state'));
  const returnTo = pending?.returnTo ?? '/';

  const kakaoError = searchParams.get('error');
  if (kakaoError !== null) return { returnTo, outcome: { kind: 'kakao-error', error: kakaoError } };
  if (pending === null) return { returnTo, outcome: { kind: 'state-mismatch' } };
  const code = searchParams.get('code');
  if (code === null) return { returnTo, outcome: { kind: 'missing-code' } };

  const result = await loginWithKakao({
    code,
    redirectUri: callbackUri(),
    resultId: readSession()?.resultId ?? null,
    ref: null,
  });
  if (!result.ok) return { returnTo, outcome: { kind: 'api-error', error: result.error } };
  return { returnTo, outcome: { kind: 'success', restoredResultId: result.data.restoredResultId } };
}
