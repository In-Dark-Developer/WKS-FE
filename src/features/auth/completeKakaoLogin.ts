import { loginWithKakao } from '@/api/auth';
import { writeAuthToken } from '@/api/authToken';
import type { ApiFailure } from '@/api/client';
import type { KakaoLoginResponse } from '@/api/schema/auth';
import { readSession } from '@/api/session';

import { consumeKakaoState } from './kakaoAuthorizeUrl';

export type CompleteKakaoLoginResult =
  | { kind: 'success'; data: KakaoLoginResponse }
  | { kind: 'kakao-error'; error: string } // 카카오가 콜백에 ?error=... 를 실어 보냈다(사용자 취소 등)
  | { kind: 'state-mismatch' } // CSRF 방지 state 불일치 — 다른 곳에서 시작된 흐름이거나 재사용 시도
  | { kind: 'missing-code' }
  | { kind: 'api-error'; error: ApiFailure };

// 콜백 화면이 받은 쿼리스트링으로 로그인을 마무리한다. 성공하면 토큰을 저장한다
// (ADR-20260922-kakao-login-and-jwt-session). 이 브라우저에 '내 결과'(resultId)가 있으면 함께 보내
// 계정에 연결·복원한다(plan.md §1.1) — resultId 가 없어도 로그인 자체는 그대로 성공한다.
// redirectUri 는 로그인 시작 때와 문자 그대로 같아야 한다(백엔드가 정확히 일치하는 값만 허용한다).
export async function completeKakaoLogin(
  searchParams: URLSearchParams,
  redirectUri: string,
): Promise<CompleteKakaoLoginResult> {
  const kakaoError = searchParams.get('error');
  if (kakaoError !== null) {
    return { kind: 'kakao-error', error: kakaoError };
  }

  // state 검증을 먼저 한다 — code 유무와 무관하게 저장된 state 를 항상 소비해(재사용 방지) 지운다.
  if (!consumeKakaoState(searchParams.get('state'))) {
    return { kind: 'state-mismatch' };
  }

  const code = searchParams.get('code');
  if (code === null) {
    return { kind: 'missing-code' };
  }

  const outcome = await loginWithKakao({
    code,
    redirectUri,
    resultId: readSession()?.resultId ?? null,
    ref: null,
  });
  if (!outcome.ok) {
    return { kind: 'api-error', error: outcome.error };
  }

  writeAuthToken(outcome.data.token);
  return { kind: 'success', data: outcome.data };
}
