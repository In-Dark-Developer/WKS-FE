import { request, type ApiOutcome } from './client';
import { meSchema, type Me } from './schema/me';
import { readSession } from './session';

export type { Me } from './schema/me';

// 로그인 판단의 단일 출처(ARCHITECTURE V1) — 화면은 토큰을 보지 않고 이 응답으로만 로그인 여부를 안다.
// 인증 헤더는 로그인 Task(09/T2)가 client 에 싣는다. 그 전까지 실제 모드의 GET /me 는 401 이 온다.
// `VITE_API_MOCK=true` 면 이 파일 안의 목 계정을 돌려준다(results.ts 와 같은 규칙).
const isMockEnabled = () => import.meta.env.VITE_API_MOCK === 'true';

// 목 계정 — 새로고침하면 로그아웃 상태로 돌아간다. 사주 유무는 이 브라우저의 '내 결과'로 흉내 낸다.
const mockAccount = { isSignedIn: false, hasDatingProfile: false };

export function signInMockAccount(): void {
  mockAccount.isSignedIn = true;
}

export function signOutMockAccount(): void {
  mockAccount.isSignedIn = false;
  mockAccount.hasDatingProfile = false;
}

// 목 모드에서 프로필 저장(dating.ts)이 성공하면 부른다.
export function markMockDatingProfile(): void {
  mockAccount.hasDatingProfile = true;
}

function mockGetMe(): ApiOutcome<Me> {
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
      hasResult: readSession() !== null,
      hasDatingProfile: mockAccount.hasDatingProfile,
      threadBalance: mockAccount.hasDatingProfile ? 10 : 0,
    },
  };
}

// GET /me — 로그인 상태 요약(FR-24). 비로그인·토큰 만료는 401 UNAUTHENTICATED 로 온다.
export async function getMe(): Promise<ApiOutcome<Me>> {
  if (isMockEnabled()) return mockGetMe();
  return request({ method: 'GET', path: '/me' }, meSchema);
}

export function isUnauthenticated(outcome: ApiOutcome<unknown>): boolean {
  return !outcome.ok && outcome.error.kind === 'api' && outcome.error.code === 'UNAUTHENTICATED';
}
