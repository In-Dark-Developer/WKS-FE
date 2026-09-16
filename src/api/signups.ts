import { request, type ApiOutcome } from './client';
import {
  resendSignupSchema,
  signupRequestSchema,
  signupSchema,
  type ResendSignup,
  type Signup,
  type SignupRequestInput,
} from './schema/signups';

export type { ContactMethod, SignupRequestInput } from './schema/signups';

// POST /signups — 소개팅 사전등록 (FR-9, FR-10). 성공하면 백엔드가 학교 웹메일로 인증 링크를 보내고,
// 그 링크는 `GET /signups/verify` 를 거쳐 프론트 `/verify`(SCR-14)로 돌아온다.
// 이미 신청한 이메일은 409 DUPLICATE_SIGNUP, 학교 도메인이 아니면 400 INVALID_EMAIL_DOMAIN 이다.
export async function createSignup(input: SignupRequestInput): Promise<ApiOutcome<Signup>> {
  const body = signupRequestSchema.parse(input); // 호출자(내부 코드)의 모양 실수를 개발 중 바로 잡는다
  return request({ method: 'POST', path: '/signups', body }, signupSchema);
}

// POST /signups/resend — 인증 메일 재발송. 이미 인증을 마쳤거나 신청 내역이 없으면 400 INVALID_INPUT 이다.
export async function resendSignupMail(email: string): Promise<ApiOutcome<ResendSignup>> {
  return request({ method: 'POST', path: '/signups/resend', body: { email } }, resendSignupSchema);
}
