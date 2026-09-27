import type { ApiFailure } from '@/api/client';

import type { EmailVerificationError } from '../profile/emailVerificationView';

// 백엔드 오류 → 화면 오류(WKS-BE api-spec §10.7 · emailVerificationView 주석).
// 그 밖(연결 실패·스키마)은 메일 발송 실패와 같게 다룬다 — 사용자가 할 일이 '다시 시도'로 같다.
export function toEmailVerificationError(error: ApiFailure): EmailVerificationError {
  if (error.kind !== 'api') return 'mail-unavailable';
  switch (error.code) {
    case 'INVALID_EMAIL_DOMAIN':
      return 'invalid-domain';
    case 'DATING_PROFILE_CONFLICT':
      return 'conflict';
    case 'EMAIL_CODE_RATE_LIMITED':
      return 'rate-limited';
    case 'INVALID_EMAIL_CODE':
      return 'invalid-code';
    default:
      return 'mail-unavailable';
  }
}

// 재발송 가능 시각(ISO) → epoch ms. 화면 타이머가 쓴다. 읽을 수 없으면 타이머를 걸지 않는다.
export function toResendAt(isoDate: string): number | undefined {
  const at = Date.parse(isoDate);
  return Number.isNaN(at) ? undefined : at;
}
