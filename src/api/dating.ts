import { request, type ApiOutcome } from './client';
import { linkMockAccountResult, markMockDatingProfile, readMockAccountResultId } from './me';
import { readSession } from './session';
import {
  datingProfileRequestSchema,
  datingProfileSchema,
  datingRecommendationsSchema,
  type DatingCandidate,
  type DatingProfile,
  type DatingProfileRequest,
  type DatingRecommendations,
} from './schema/dating';

export type {
  DatingCandidate,
  DatingLockableField,
  DatingProfile,
  DatingProfileRequest,
  DatingRecommendations,
} from './schema/dating';

// 소개팅(`/api/dating/**`) 호출 — 인증 필요. `VITE_API_MOCK=true` 면 요청 없이 목 응답을 돌려준다
// (results.ts 와 같은 규칙). 백엔드는 이 경로를 아직 Bearer 로 받으므로(api-spec.md §10) 쿠키 전환 전까지
// 실제 모드로 부를 수 없다 — 공지 2026-09-25-cookie-auth-contract.
const isMockEnabled = () => import.meta.env.VITE_API_MOCK === 'true';

const MOCK_SAVE_DELAY_MS = 600;

function buildMockProfile(input: DatingProfileRequest): DatingProfile {
  // 목 프로필은 학교 메일 인증을 마친 것으로 둔다 — 추천 화면(10/T3)까지 이어서 볼 수 있게.
  return { ...input, candidateId: crypto.randomUUID(), emailVerified: true };
}

// 백엔드는 계정에 연결된 결과가 없으면 404 로 막는다(§10.2). 연결은 로그인 때만 일어나므로(§9 연결·복원 규칙)
// 로그인한 뒤 이 화면에서 사주를 만든 사람은 연결할 방법이 없다 — 목 모드는 그 연결을 대신해 흐름을 잇는다.
function mockAccountResultId(): string | null {
  const linked = readMockAccountResultId();
  if (linked !== null) return linked;
  const browsed = readSession()?.resultId ?? null;
  if (browsed !== null) linkMockAccountResult(browsed);
  return browsed;
}

// POST /dating/profile — 프로필 등록(FR-25). 계정에 연결된 사주가 없으면 404 RESULT_NOT_FOUND,
// 이미 등록했거나 학교 이메일이 겹치면 409 DATING_PROFILE_CONFLICT 다.
export async function createDatingProfile(
  input: DatingProfileRequest,
): Promise<ApiOutcome<DatingProfile>> {
  const body = datingProfileRequestSchema.parse(input); // 호출자(내부 코드)의 모양 실수를 개발 중 바로 잡는다
  if (isMockEnabled()) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_SAVE_DELAY_MS));
    if (mockAccountResultId() === null) {
      return {
        ok: false,
        error: { kind: 'api', code: 'RESULT_NOT_FOUND', message: '사주 결과를 찾을 수 없어요.' },
      };
    }
    markMockDatingProfile();
    return { ok: true, data: buildMockProfile(body) };
  }
  return request({ method: 'POST', path: '/dating/profile', body }, datingProfileSchema);
}

// 목 후보 — 잠금 비용은 백엔드 기본값(photo 10 · name 7 · department 5 · reason 3)과 같게 둔다.
const mockCandidateSeeds = [
  {
    score: 98,
    mbti: 'ENTP',
    bio: '영화와 전시 보러 다니는 걸 좋아해요. 축제 공연도 같이 볼 사람을 찾아요.',
    name: '이서연',
    department: '영화영상학과',
  },
  {
    score: 87,
    mbti: 'INFJ',
    bio: '조용한 카페에서 책 읽는 걸 좋아해요.',
    name: '박지훈',
    department: '국어국문학과',
  },
  {
    score: 68,
    mbti: 'ISFP',
    bio: '운동하고 맛집 다니는 걸 좋아합니다.',
    name: '최유나',
    department: '체육교육과',
  },
] as const;

// 목 해금 값 — 사진은 원본 대신 한 색 사각형(data URI)을 준다(api 는 ui 에셋을 import 하지 않는다).
const MOCK_PHOTO_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 4'%3E%3Crect width='3' height='4' fill='%23e8b4b8'/%3E%3C/svg%3E";
const MOCK_REASON = '서로의 부족한 기운을 채워 주는 사이라 함께할수록 편안해져요.';

export type MockUnlockKey = keyof DatingCandidate['fields'];

function findMockCandidate(candidateId: string): number {
  return mockCandidates?.findIndex((candidate) => candidate.candidateId === candidateId) ?? -1;
}

// 목 모드 해금(unlocks.ts) — 지금 추천에 있는 후보의 항목을 여는 데 드는 비용. 없는 후보면 null, 이미 열렸으면 0.
export function readMockUnlockCost(candidateId: string, key: MockUnlockKey): number | null {
  const candidate = mockCandidates?.[findMockCandidate(candidateId)];
  if (candidate === undefined) return null;
  const field = candidate.fields[key];
  return field.locked ? field.cost : 0;
}

// 목 모드 해금 — 항목을 열고 값을 돌려준다. 차감은 부르는 쪽(unlocks.ts)이 먼저 한다.
export function openMockCandidateField(candidateId: string, key: MockUnlockKey): string | null {
  const index = findMockCandidate(candidateId);
  const candidate = mockCandidates?.[index];
  const seed = mockCandidateSeeds[index];
  if (mockCandidates === null || candidate === undefined || seed === undefined) return null;
  const values: Record<MockUnlockKey, string> = {
    photo: MOCK_PHOTO_URL,
    name: seed.name,
    department: seed.department,
    reason: MOCK_REASON,
  };
  mockCandidates[index] = {
    ...candidate,
    fields: { ...candidate.fields, [key]: { locked: false, value: values[key] } },
  };
  return values[key];
}

function buildMockCandidates(): DatingCandidate[] {
  return mockCandidateSeeds.map((seed, index) => ({
    rank: index + 1,
    candidateId: crypto.randomUUID(),
    score: seed.score,
    mbti: seed.mbti,
    bio: seed.bio,
    fields: {
      photo: { locked: true, cost: 10 },
      name: { locked: true, cost: 7 },
      department: { locked: true, cost: 5 },
      reason: { locked: true, cost: 3 },
    },
  }));
}

// 목 모드에서만 쓰는 추천 보관 — 리롤해야 바뀐다(실제 모드는 백엔드가 같은 규칙을 갖는다).
let mockCandidates: DatingCandidate[] | null = null;

export function resetMockRecommendations(): void {
  mockCandidates = null;
}

// GET /dating/recommendations — 오늘의 인연 Top 3(FR-26). 학교 메일 인증 전에는 403 DATING_NOT_VERIFIED,
// 내 프로필이 없으면 404 DATING_PROFILE_NOT_FOUND 다.
export async function getRecommendations(): Promise<ApiOutcome<DatingRecommendations>> {
  if (isMockEnabled()) {
    mockCandidates ??= buildMockCandidates();
    return { ok: true, data: { candidates: mockCandidates } };
  }
  return request({ method: 'GET', path: '/dating/recommendations' }, datingRecommendationsSchema);
}

// 리롤(FR-27) — 백엔드에 아직 경로가 없다(api-spec.md §10 '#84 구현 상태'). 목 모드에서만 새 세 명을 만들고,
// 실제 모드는 요청 없이 실패로 돌려준다 — 화면은 추천을 그대로 두고 안내만 띄운다.
export async function rerollRecommendations(): Promise<ApiOutcome<DatingRecommendations>> {
  if (!isMockEnabled()) {
    return {
      ok: false,
      error: { kind: 'api', code: 'NOT_FOUND', message: '다시 점지하기는 아직 준비 중이에요.' },
    };
  }
  await new Promise((resolve) => setTimeout(resolve, MOCK_SAVE_DELAY_MS));
  mockCandidates = buildMockCandidates();
  return { ok: true, data: { candidates: mockCandidates } };
}
