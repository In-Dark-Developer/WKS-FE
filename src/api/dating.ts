import type { ApiOutcome } from './client';
import { markMockDatingProfile } from './me';
import { datingProfileRequestSchema, type DatingProfileRequest } from './schema/dating';

export type { DatingProfileRequest } from './schema/dating';

// 소개팅(`/api/dating/**`) 호출 — 인증 필요. 백엔드 명세가 아직 없어(2026-09-24) 목 모드만 동작한다.
const isMockEnabled = () => import.meta.env.VITE_API_MOCK === 'true';

const MOCK_SAVE_DELAY_MS = 600;

// 프로필 저장(FR-25). 실제 모드는 부를 경로가 정해지지 않아 요청 없이 실패로 돌려준다 — 화면은 연결 실패와
// 같게 입력값을 둔 채 다시 시도하게 한다. 명세가 오면 request(POST …) 로 바꾼다.
export async function saveDatingProfile(input: DatingProfileRequest): Promise<ApiOutcome<null>> {
  datingProfileRequestSchema.parse(input); // 호출자(내부 코드)의 모양 실수를 개발 중 바로 잡는다
  if (!isMockEnabled()) {
    return {
      ok: false,
      error: {
        kind: 'api',
        code: 'NOT_FOUND',
        message: '소개팅 프로필 저장은 아직 준비 중이에요.',
      },
    };
  }
  await new Promise((resolve) => setTimeout(resolve, MOCK_SAVE_DELAY_MS));
  markMockDatingProfile();
  return { ok: true, data: null };
}
