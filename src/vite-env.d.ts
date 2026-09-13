/// <reference types="vite/client" />

// `src/api/client.ts` 가 읽는 VITE_ 환경변수 타입 (ARCHITECTURE Cross-cutting Concerns).
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_API_MOCK?: string;
}
