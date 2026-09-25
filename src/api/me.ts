import { z } from 'zod';

import { request, type ApiOutcome } from './client';
import { meSchema, type Me } from './schema/me';
import { readSession } from './session';

export type { Me } from './schema/me';

// 로그인 판단의 단일 출처(ARCHITECTURE V1) — 화면은 쿠키를 보지 않고 이 응답으로만 로그인 여부를 안다.
// 세션은 HttpOnly 쿠키이고 client 가 `credentials: 'include'` 로 싣는다(openapi cookieAuth).
// `VITE_API_MOCK=true` 면 이 파일 안의 목 계정을 돌려준다(results.ts 와 같은 규칙).
const isMockEnabled = () => import.meta.env.VITE_API_MOCK === 'true';

// 목 계정 — 쿠키처럼 새로고침·카카오 왕복(전체 페이지 이동)에도 남도록 localStorage 에 둔다. 목 모드에서만 쓴다.
// resultId 는 계정에 연결된 결과(백엔드 계정당 1개)이고 로그아웃해도 남는다 — 다시 로그인하면 복원된다(auth.ts).
const MOCK_KEY = 'wks:mock-account';
const mockAccountSchema = z.object({
  isSignedIn: z.boolean(),
  hasDatingProfile: z.boolean(),
  resultId: z.string().uuid().nullable().catch(null),
});
type MockAccount = z.infer<typeof mockAccountSchema>;
const signedOut: MockAccount = { isSignedIn: false, hasDatingProfile: false, resultId: null };

function readMockAccount(): MockAccount {
  try {
    const raw = localStorage.getItem(MOCK_KEY);
    if (raw === null) return signedOut;
    const parsed = mockAccountSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : signedOut;
  } catch {
    // 스토리지가 막혔거나 JSON 이 깨졌으면 로그아웃으로 본다.
    return signedOut;
  }
}

function writeMockAccount(account: MockAccount): void {
  try {
    localStorage.setItem(MOCK_KEY, JSON.stringify(account));
  } catch {
    // 저장소가 막힌 브라우저에서는 목 로그인이 유지되지 않는다 — 목 모드 전용이라 감수한다.
  }
}

export function signInMockAccount(): void {
  writeMockAccount({ ...readMockAccount(), isSignedIn: true });
}

export function signOutMockAccount(): void {
  writeMockAccount({ ...readMockAccount(), isSignedIn: false, hasDatingProfile: false });
}

// 목 계정에 연결된 결과 — 목 로그인(auth.ts)이 백엔드 연결·복원 규칙을 흉내 낼 때 읽고 쓴다.
export function readMockAccountResultId(): string | null {
  return readMockAccount().resultId;
}

export function linkMockAccountResult(resultId: string): void {
  writeMockAccount({ ...readMockAccount(), resultId });
}

// 테스트 전용 — 계정까지 지운다.
export function resetMockAccount(): void {
  writeMockAccount(signedOut);
}

// 목 모드에서 프로필 저장(dating.ts)이 성공하면 부른다.
export function markMockDatingProfile(): void {
  writeMockAccount({ ...readMockAccount(), hasDatingProfile: true });
}

function mockGetMe(): ApiOutcome<Me> {
  const mockAccount = readMockAccount();
  if (!mockAccount.isSignedIn) {
    return {
      ok: false,
      error: { kind: 'api', code: 'UNAUTHENTICATED', message: '로그인이 필요해요.' },
    };
  }
  return {
    ok: true,
    data: {
      memberId: 1,
      hasResult: mockAccount.resultId !== null || readSession() !== null,
      hasDatingProfile: mockAccount.hasDatingProfile,
      threadBalance: mockAccount.hasDatingProfile ? 10 : 0,
    },
  };
}

// GET /me — 로그인 상태 요약(FR-24). 비로그인·쿠키 만료는 401 UNAUTHENTICATED 로 온다.
export async function getMe(): Promise<ApiOutcome<Me>> {
  if (isMockEnabled()) return mockGetMe();
  return request({ method: 'GET', path: '/me' }, meSchema);
}

export function isUnauthenticated(outcome: ApiOutcome<unknown>): boolean {
  return !outcome.ok && outcome.error.kind === 'api' && outcome.error.code === 'UNAUTHENTICATED';
}
