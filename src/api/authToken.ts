import { z } from 'zod';

// 로그인 토큰 보관은 이 파일만 한다 — `src/api/session.ts`(브라우저의 '내 결과' resultId)와는 다른
// 키다. 세션은 로그인과 무관하게 그대로 동작하고(ADR-20260914-result-ownership-in-browser), 이 토큰은
// 로그인했을 때만 생긴다(ADR-20260922-kakao-login-and-jwt-session). 서버는 토큰을 폐기하지 않는다 —
// 로그아웃은 이 키를 지우는 것으로 처리하고(clearAuthToken, 2026-09-23), 지우지 않은 사본은
// 만료(발급 후 15일)까지는 여전히 유효하다.
const KEY = 'wks:auth';

// refreshToken 은 없다 — 만료되면 재로그인한다(카카오 원클릭이라 마찰이 적다는 판단, 2026-09-23).
const authTokenSchema = z.object({ v: z.literal(1), accessToken: z.string().min(1) });

export function readAuthToken(): string | null {
  let raw: string | null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    // 스토리지가 막힌 브라우저(사생활 보호 모드 등)는 로그인 안 됨으로 본다.
    return null;
  }
  if (raw === null) return null;

  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    value = null;
  }
  const parsed = authTokenSchema.safeParse(value);
  if (!parsed.success) {
    clearAuthToken();
    return null;
  }
  return parsed.data.accessToken;
}

export function writeAuthToken(accessToken: string): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ v: 1, accessToken }));
  } catch {
    // 저장하지 못하면 이번 방문 동안만 로그인 없이 동작한다.
  }
}

// 로그아웃. 서버에 알리지 않는다 — 서버는 토큰 상태를 들고 있지 않는다(클라이언트만 지우는 방식,
// 2026-09-23 결정). 지우기 전에 유출된 사본은 만료까지 유효하다.
export function clearAuthToken(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // 지울 수 없는 스토리지는 읽기도 실패하므로 로그인 안 됨과 같다.
  }
}
