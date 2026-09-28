import { request, type ApiOutcome } from './client';
import { compatibilityReasonSchema, type CompatibilityReason } from './schema/compatibility';

export type { CompatibilityReason } from './schema/compatibility';

const isMockEnabled = () => import.meta.env.VITE_API_MOCK === 'true';

// 목 모드에서는 첫 생성이 느린 것까지 흉내 낸다 — 로딩 화면을 개발 중에 볼 수 있게.
async function mockGetCompatibilityReason(): Promise<ApiOutcome<CompatibilityReason>> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return {
    ok: true,
    data: {
      why: '나무의 기운이 불의 기운을 살리는 사이라, 함께 있으면 서로의 장점이 더 잘 드러나요.',
      together: '함께 있으면 한 사람이 먼저 길을 내고 다른 사람이 그 길을 밝혀 주는 사이예요.',
      conflict: '불의 기운 쪽이 먼저 달아오르기 쉬워요. 한 박자 쉬고 이야기하면 금방 풀려요.',
    },
  };
}

// GET /compatibilities/{id}/reason — 궁합 상세 이유 세 문단(FR-22). 처음 열 때 생성해 캐싱하므로 첫 호출만
// 느리다(최대 30초, openapi). 생성 실패는 503 LLM_UNAVAILABLE 로 오고 다시 부르면 된다.
export async function getCompatibilityReason(
  compatibilityId: number,
): Promise<ApiOutcome<CompatibilityReason>> {
  if (isMockEnabled()) return mockGetCompatibilityReason();
  return request(
    { method: 'GET', path: `/compatibilities/${compatibilityId}/reason` },
    compatibilityReasonSchema,
  );
}
