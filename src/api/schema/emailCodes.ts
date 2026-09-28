import { z } from 'zod';

// 학교 메일 코드 인증 — docs/api/openapi.yaml `/dating/email-codes`·`/verify` (WKS-BE api-spec §10.7).
// 코드는 6자리 숫자·10분 유효. 다시 보내면 이전 코드와 이미 인증된 상태가 무효가 된다.
export const datingEmailCodeSentSchema = z.object({
  expiresAt: z.string(),
  // 재발송 가능 시각(발송 + 60초) — 화면 타이머가 쓴다.
  resendAvailableAt: z.string(),
});

export type DatingEmailCodeSent = z.infer<typeof datingEmailCodeSentSchema>;

export const datingEmailCodeVerifiedSchema = z.object({
  email: z.email(),
  verified: z.literal(true),
});

export type DatingEmailCodeVerified = z.infer<typeof datingEmailCodeVerifiedSchema>;
