/// <reference types="vite/client" />

// `src/api/client.ts` 가 읽는 VITE_ 환경변수 타입 (ARCHITECTURE Cross-cutting Concerns).
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_API_MOCK?: string;
  // 카카오 앱 REST API 키 — `features/auth/kakaoLogin.ts` 가 인가 URL 에 싣는다(공개값, 비밀 아님).
  readonly VITE_KAKAO_CLIENT_ID?: string;
  // 서비스 오픈 시각(ISO 8601) — 운영 배포에만 둔다. 그 전에는 오픈 대기 화면만 보인다(`features/intro/openingGate.ts`).
  readonly VITE_OPEN_AT?: string;
  // 소개팅 프로필 등록 마감 시각(ISO 8601) — 운영 배포에만 둔다. 이후 (2/2) 제출 버튼이 비활성이 된다(`features/dating/profile/registrationClose.ts`).
  readonly VITE_DATING_CLOSE_AT?: string;
}
