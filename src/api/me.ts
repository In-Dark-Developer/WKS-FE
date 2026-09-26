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
  // 목 모드 실 원장(WKS-BE §12) — 가입 10 은 최초 로그인에 한 번, 출석 5 는 하루 한 번 쌓이고
  // 해금(unlocks.ts)이 쓴 만큼 빠진다. 잔액은 항상 이 셋의 합이다.
  threadEarned: z.number().int().nonnegative().catch(0),
  threadSpent: z.number().int().nonnegative().catch(0),
  // 마지막 출석 날짜(YYYY-MM-DD, 기기 시각) — 실제 판정은 백엔드가 KST 로 한다.
  lastCheckInDate: z.string().nullable().catch(null),
});
type MockAccount = z.infer<typeof mockAccountSchema>;
const signedOut: MockAccount = {
  isSignedIn: false,
  hasDatingProfile: false,
  resultId: null,
  threadEarned: 0,
  threadSpent: 0,
  lastCheckInDate: null,
};

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

// 가입 지급 10 은 계정당 한 번이다 — 백엔드는 카카오 최초 로그인에 준다(§12).
const MOCK_SIGNUP_REWARD = 10;
const MOCK_CHECK_IN_REWARD = 5;

export function signInMockAccount(): void {
  const account = readMockAccount();
  const isFirst = account.threadEarned === 0 && account.threadSpent === 0;
  writeMockAccount({
    ...account,
    isSignedIn: true,
    threadEarned: isFirst ? MOCK_SIGNUP_REWARD : account.threadEarned,
  });
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

function mockBalance(account: MockAccount): number {
  return Math.max(0, account.threadEarned - account.threadSpent);
}

function mockToday(): string {
  return new Date().toISOString().slice(0, 10);
}

// 목 모드 잔액 조회(wallet.ts) — 백엔드 `GET /wallet` 과 같은 모양으로 돌려준다.
export function readMockBalance(): { balance: number; canCheckInToday: boolean } {
  const account = readMockAccount();
  return {
    balance: mockBalance(account),
    canCheckInToday: account.lastCheckInDate !== mockToday(),
  };
}

// 목 모드 출석(wallet.ts) — 오늘 이미 받았으면 지급 없이 checkedIn: false 다.
export function checkInMockWallet(): { checkedIn: boolean; balance: number } {
  const account = readMockAccount();
  const today = mockToday();
  if (account.lastCheckInDate === today) {
    return { checkedIn: false, balance: mockBalance(account) };
  }
  const next = {
    ...account,
    threadEarned: account.threadEarned + MOCK_CHECK_IN_REWARD,
    lastCheckInDate: today,
  };
  writeMockAccount(next);
  return { checkedIn: true, balance: mockBalance(next) };
}

// 목 모드 해금(unlocks.ts)이 부른다 — 잔액이 모자라면 쓰지 않고 null, 쓰면 남은 잔액을 돌려준다.
export function spendMockThread(cost: number): number | null {
  const account = readMockAccount();
  const balance = mockBalance(account);
  if (cost > balance) return null;
  writeMockAccount({ ...account, threadSpent: account.threadSpent + cost });
  return balance - cost;
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
      threadBalance: mockBalance(mockAccount),
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
