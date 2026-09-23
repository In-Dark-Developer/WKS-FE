import { z } from 'zod';

import { request, type ApiOutcome } from './client';
import {
  kakaoLoginResponseSchema,
  meSchema,
  type KakaoLoginResponse,
  type Me,
} from './schema/auth';

// POST /auth/kakao 요청 본문(KakaoLoginRequest) — 인증이 필요 없는 API 다.
const kakaoLoginRequestSchema = z.object({
  code: z.string().min(1),
  redirectUri: z.string().min(1),
  resultId: z.string().uuid().nullable().optional(),
  ref: z.string().nullable().optional(),
});

export type KakaoLoginInput = z.infer<typeof kakaoLoginRequestSchema>;

// POST /auth/kakao — 카카오 인가 코드를 로그인 토큰으로 교환한다. 성공 응답을 저장(writeAuthToken)하는
// 것은 호출자(features/auth/completeKakaoLogin) 몫이다 — 이 함수는 순수하게 호출·검증만 한다.
export async function loginWithKakao(
  input: KakaoLoginInput,
): Promise<ApiOutcome<KakaoLoginResponse>> {
  const body = kakaoLoginRequestSchema.parse(input); // 호출자(내부 코드)의 모양 실수를 개발 중 바로 잡는다
  return request({ method: 'POST', path: '/auth/kakao', body }, kakaoLoginResponseSchema);
}

// GET /me — 인증 필요. 토큰이 없거나 만료·위조면 백엔드가 401 UNAUTHENTICATED 를 준다.
export async function fetchMe(): Promise<ApiOutcome<Me>> {
  return request({ method: 'GET', path: '/me', auth: true }, meSchema);
}
