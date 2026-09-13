import { request, type ApiOutcome } from './client';
import {
  resultDetailSchema,
  resultRequestSchema,
  resultSchema,
  type Result,
  type ResultDetail,
  type ResultRequestInput,
} from './schema/result';
import { writeSession } from './session';

export type { ResultRequestInput } from './schema/result';

// 백엔드 dev 에는 POST /results 만 있고 GET /results/{id} 는 미구현이다(2026-09-13,
// docs/phases/03-saju-reading/PLAN.md Dependencies). 백엔드 없이 화면을 개발할 수 있도록
// `VITE_API_MOCK=true`(로컬 .env, 기본은 꺼짐) 일 때 이 파일 안에서 만든 목 응답을 대신 돌려준다.
// Q16(세션 토큰 계약)이 오기 전까지는 이 목 응답이 유일하게 토큰을 돌려주는 경로다.
const isMockEnabled = () => import.meta.env.VITE_API_MOCK === 'true';

const mockResults = new Map<string, ResultDetail>();

function buildMockResult(input: ResultRequestInput): Result {
  return {
    resultId: crypto.randomUUID(),
    nickname: input.nickname,
    destiny: { title: '점지된 인연', description: '오늘 만난 인연이 오래갈 운명이에요.' },
    fortunes: [
      { category: 'MARRIAGE', grade: 'A0', content: '좋은 배필을 만날 운명이에요.' },
      { category: 'CHILDREN', grade: 'B+', content: '자녀와의 인연이 따뜻해요.' },
      { category: 'LOVE', grade: 'SS', content: '올해 인연운이 아주 좋아요.' },
    ],
    luckyItem: '파란색 팔찌',
    luckyPlace: '동국대 팔정도',
  };
}

async function mockCreateResult(input: ResultRequestInput): Promise<ApiOutcome<Result>> {
  const result = buildMockResult(input);
  mockResults.set(result.resultId, { ...result, compatibilities: [] });
  // 실제 계약에는 아직 토큰이 없다(PRD Q16) — 보호 라우트를 로컬에서 확인할 수 있게 목 토큰을 써 둔다.
  writeSession(`mock-${result.resultId}`);
  return { ok: true, data: result };
}

async function mockGetResult(resultId: string): Promise<ApiOutcome<ResultDetail>> {
  const found = mockResults.get(resultId);
  if (!found) {
    return {
      ok: false,
      error: { kind: 'api', code: 'RESULT_NOT_FOUND', message: '점지된 결과를 찾을 수 없어요.' },
    };
  }
  return { ok: true, data: found };
}

// POST /results — 사주 입력으로 결과를 만든다 (FR-2, FR-3). 3~10초 걸릴 수 있다(openapi 설명) —
// 호출하는 쪽(route action)이 로딩 UX를 맡는다.
export async function createResult(input: ResultRequestInput): Promise<ApiOutcome<Result>> {
  const body = resultRequestSchema.parse(input); // 호출자(내부 코드)의 모양 실수를 개발 중 바로 잡는다
  if (isMockEnabled()) return mockCreateResult(body);
  return request({ method: 'POST', path: '/results', body }, resultSchema);
}

// GET /results/{resultId} — 결과 재조회(FR-3, FR-8, FR-15). 세션이 없어 resultId 로만 구분한다.
export async function getResult(resultId: string): Promise<ApiOutcome<ResultDetail>> {
  if (isMockEnabled()) return mockGetResult(resultId);
  return request({ method: 'GET', path: `/results/${resultId}` }, resultDetailSchema);
}
