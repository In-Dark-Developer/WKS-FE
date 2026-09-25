/// <reference types="vite/client" />

// `src/api/client.ts` 가 읽는 VITE_ 환경변수 타입 (ARCHITECTURE Cross-cutting Concerns).
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_API_MOCK?: string;
  // 카카오 앱 REST API 키 — `features/auth/kakaoLogin.ts` 가 인가 URL 에 싣는다(공개값, 비밀 아님).
  readonly VITE_KAKAO_CLIENT_ID?: string;
}
