// 학교 메일 코드 인증 뷰 모델 — 발송·확인 요청과 응답 해석은 연동 Task(10/T1)가 하고 화면은 상태만 그린다(FR-25).
// 계약은 `docs/api/openapi.yaml` 의 `/dating/email-codes`·`/dating/email-codes/verify`.
export type EmailVerificationStatus = 'idle' | 'sending' | 'sent' | 'verifying' | 'verified';

// 오류 코드 → 화면 오류: INVALID_EMAIL_DOMAIN → invalid-domain · DATING_PROFILE_CONFLICT → conflict ·
// EMAIL_CODE_RATE_LIMITED → rate-limited · MAIL_UNAVAILABLE → mail-unavailable · INVALID_EMAIL_CODE → invalid-code.
export type EmailVerificationError =
  'invalid-domain' | 'conflict' | 'rate-limited' | 'mail-unavailable' | 'invalid-code';

export type EmailVerificationView = {
  status: EmailVerificationStatus;
  // 발송 응답의 `resendAvailableAt`(epoch ms). 이 시각까지 재발송 버튼이 초를 센다.
  resendAvailableAt?: number;
  error?: EmailVerificationError;
};

export const emailVerificationMessages: Record<EmailVerificationError, string> = {
  'invalid-domain': 'dgu 메일만 인증할 수 있어요',
  conflict: '이미 다른 계정에서 쓰고 있는 메일이에요',
  'rate-limited': '인증 요청이 너무 많아요. 잠시 후 다시 시도해 주세요',
  'mail-unavailable': '메일을 보내지 못했어요. 다시 시도해 주세요',
  'invalid-code': '코드가 맞지 않거나 만료됐어요. 다시 확인하거나 새 코드를 받아 주세요',
};

// 코드 입력칸 아래에 둘 오류 — 나머지는 메일 입력칸 아래에 둔다.
export const isCodeError = (error: EmailVerificationError) => error === 'invalid-code';
