import type { ApiFailure } from '@/api/client';

// 프로필 저장이 막혔을 때의 안내(FR-25). 전에는 무엇이 틀렸든 '연결이 원활하지 않아요' 하나였다
// (2026-09-29 QA) — 사진이 백엔드 한도를 넘어 거절돼도 연결 탓으로 읽혔다.
// 입력값은 어느 경우에도 폼에 남으므로 '다시 시도'가 늘 가능한 다음 행동이다.
const CONNECTION = '연결이 원활하지 않아요. 입력한 내용은 유지됩니다.';

export function toProfileSubmitError(error: ApiFailure): string {
  if (error.kind !== 'api') return CONNECTION;
  switch (error.code) {
    // 저장 단계에서 사진을 거절하는 경로는 백엔드 한도(10MB · 2천만 화소 · 열 수 없는 파일)뿐이다.
    case 'INVALID_INPUT':
      return '사진을 등록하지 못했어요. 10MB 이하의 JPEG·PNG 사진으로 다시 올려 주세요.';
    case 'DATING_PROFILE_CONFLICT':
      return '이미 등록된 프로필이나 학교 메일이에요. 다른 메일로 시도해 주세요.';
    case 'INVALID_EMAIL_DOMAIN':
      return '학교 메일(@dgu.ac.kr)로만 등록할 수 있어요.';
    case 'UNAUTHENTICATED':
      return '로그인이 풀렸어요. 다시 로그인하면 입력한 내용으로 이어서 등록할 수 있어요.';
    case 'DATING_NOT_VERIFIED':
      return '학교 메일 인증을 먼저 마쳐 주세요.';
    default:
      return '등록하지 못했어요. 잠시 뒤 다시 시도해 주세요. 입력한 내용은 유지됩니다.';
  }
}
