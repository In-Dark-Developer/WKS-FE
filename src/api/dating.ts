import { request, type ApiOutcome } from './client';
import { linkMockAccountResult, markMockDatingProfile, readMockAccountResultId } from './me';
import { readSession } from './session';
import {
  datingProfileRequestSchema,
  datingProfileSchema,
  type DatingProfile,
  type DatingProfileRequest,
} from './schema/dating';

export type { DatingProfile, DatingProfileRequest } from './schema/dating';

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
