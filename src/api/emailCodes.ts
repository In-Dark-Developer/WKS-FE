import { request, type ApiOutcome } from './client';
import {
  datingEmailCodeSentSchema,
  datingEmailCodeVerifiedSchema,
  type DatingEmailCodeSent,
  type DatingEmailCodeVerified,
} from './schema/emailCodes';

export type { DatingEmailCodeSent, DatingEmailCodeVerified } from './schema/emailCodes';

// 학교 메일 코드 인증(FR-25) — 인증 필요. 프로필 등록 전에 끝내야 한다(WKS-BE api-spec §10.7).
// `VITE_API_MOCK=true` 면 요청 없이 목 코드(123456)로 흉내 낸다 — 퍼블리싱 미리보기와 같은 값이다.
const isMockEnabled = () => import.meta.env.VITE_API_MOCK === 'true';

export const MOCK_EMAIL_CODE = '123456';
const MOCK_SEND_DELAY_MS = 400;
const CODE_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;

// POST /dating/email-codes — 코드 메일을 보낸다. 학교 메일이 아니면 400 INVALID_EMAIL_DOMAIN,
// 다른 계정이 쓰는 메일이면 409 DATING_PROFILE_CONFLICT, 너무 잦으면 429 EMAIL_CODE_RATE_LIMITED,
// 메일 발송 실패는 503 MAIL_UNAVAILABLE 이고 이때는 쿨다운에 걸리지 않는다.
export async function sendDatingEmailCode(email: string): Promise<ApiOutcome<DatingEmailCodeSent>> {
  if (isMockEnabled()) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_SEND_DELAY_MS));
    const now = Date.now();
    return {
      ok: true,
      data: {
        expiresAt: new Date(now + CODE_TTL_MS).toISOString(),
        resendAvailableAt: new Date(now + RESEND_COOLDOWN_MS).toISOString(),
      },
    };
  }
  return request(
    { method: 'POST', path: '/dating/email-codes', body: { email } },
    datingEmailCodeSentSchema,
  );
}

// POST /dating/email-codes/verify — 코드 확인. 불일치·만료·다른 메일은 모두 400 INVALID_EMAIL_CODE 다.
export async function verifyDatingEmailCode(
  email: string,
  code: string,
): Promise<ApiOutcome<DatingEmailCodeVerified>> {
  if (isMockEnabled()) {
    if (code !== MOCK_EMAIL_CODE) {
      return {
        ok: false,
        error: { kind: 'api', code: 'INVALID_EMAIL_CODE', message: '코드가 맞지 않아요.' },
      };
    }
    return { ok: true, data: { email, verified: true } };
  }
  return request(
    { method: 'POST', path: '/dating/email-codes/verify', body: { email, code } },
    datingEmailCodeVerifiedSchema,
  );
}
