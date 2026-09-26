import { z } from 'zod';

import { request, type ApiOutcome } from './client';
import {
  linkMockAccountResult,
  readMockAccountResultId,
  signInMockAccount,
  signOutMockAccount,
} from './me';
import { clearSession } from './session';
import { kakaoLoginResultSchema, type KakaoLoginResult } from './schema/auth';

export type { KakaoLoginResult } from './schema/auth';

// 카카오 로그인·로그아웃 — docs/api/openapi.yaml `/auth/kakao`·`/auth/logout`(WKS-BE #91 로 확정, 쿠키 `wks_token`).
// 세션은 백엔드가 Set-Cookie 로 심고 지운다. 이 파일은 토큰을 받지도 저장하지도 않는다 — 로그인 여부는 me.ts 가 판단한다.
// `VITE_API_MOCK=true` 면 me.ts 의 목 계정을 켜고 끈다(results.ts 와 같은 규칙).
const isMockEnabled = () => import.meta.env.VITE_API_MOCK === 'true';

export type KakaoLoginInput = {
  code: string;
  redirectUri: string; // 인가 요청에 쓴 것과 문자 그대로 같아야 한다(백엔드 화이트리스트)
  resultId: string | null; // 이 브라우저의 '내 결과' — 있으면 백엔드가 계정에 연결·복원한다(FR-21)
  ref: string | null; // 제휴 코드(FR-20)
};

// POST /auth/kakao — 인가 코드를 넘겨 로그인한다. 재시도하지 않는다(인가 코드는 한 번만 쓸 수 있다).
export async function loginWithKakao(
  input: KakaoLoginInput,
): Promise<ApiOutcome<KakaoLoginResult>> {
  if (isMockEnabled()) return mockLogin(input.resultId);
  return request({ method: 'POST', path: '/auth/kakao', body: input }, kakaoLoginResultSchema);
}

// 백엔드 §9 연결·복원 규칙 — 계정 결과가 있으면 그것을 복원하고, 없을 때만 브라우저 결과를 계정에 연결한다.
function mockLogin(browserResultId: string | null): ApiOutcome<KakaoLoginResult> {
  signInMockAccount();
  const accountResultId = readMockAccountResultId();
  if (accountResultId === null && browserResultId !== null) linkMockAccountResult(browserResultId);
  return {
    ok: true,
    data: { isNewUser: false, restoredResultId: accountResultId, rewardGranted: null },
  };
}

// POST /auth/logout — HttpOnly 쿠키는 프론트가 지울 수 없어 백엔드가 만료시킨다. 쿠키가 없어도 성공한다(멱등).
// 성공하면 이 브라우저의 '내 결과'도 지운다 — 로그인이 덮어쓴 계정 결과가 공용 기기에 남지 않게
// (ADR-20260927-logout-clears-browser-result). 실패하면 로그인 상태 그대로라 남긴다.
export async function logout(): Promise<ApiOutcome<null>> {
  const outcome = isMockEnabled()
    ? mockLogout()
    : await request({ method: 'POST', path: '/auth/logout' }, z.null());
  if (outcome.ok) clearSession();
  return outcome;
}

function mockLogout(): ApiOutcome<null> {
  signOutMockAccount();
  return { ok: true, data: null };
}
