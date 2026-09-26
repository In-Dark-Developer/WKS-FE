import { request, type ApiOutcome } from './client';
import {
  resultInputSchema,
  resultRequestSchema,
  resultSchema,
  type Result,
  type ResultInput,
  type ResultRequestInput,
} from './schema/result';
import { readMockAccountResultId } from './me';
import { forgetSession, writeSession } from './session';

export type { ResultInput, ResultRequestInput } from './schema/result';

// 백엔드 dev(b61f849)에는 POST /results·GET /results/{id}가 있지만, 백엔드 없이 개발·테스트할 때
// `VITE_API_MOCK=true`(로컬 .env, 기본은 꺼짐) 면 이 파일 안에서 만든 목 응답을 대신 돌려준다
// (docs/phases/03-saju-reading/PLAN.md Dependencies).
const isMockEnabled = () => import.meta.env.VITE_API_MOCK === 'true';

const mockResults = new Map<string, Result>();
const mockInputs = new Map<string, ResultInput>();

function buildMockResult(input: ResultRequestInput): Result {
  return {
    resultId: crypto.randomUUID(),
    shareId: crypto.randomUUID(),
    nickname: input.nickname,
    zodiac: 'DRAGON',
    destiny: { title: '점지된 인연', description: '오늘 만난 인연이 오래갈 운명이에요.' },
    fortunes: [
      { category: 'MARRIAGE', grade: 'A', content: '좋은 배필을 만날 운명이에요.' },
      { category: 'CHILDREN', grade: 'B+', content: '자녀와의 인연이 따뜻해요.' },
      { category: 'LOVE', grade: 'SS', content: '올해 인연운이 아주 좋아요.' },
    ],
    elements: { wood: 3, fire: 2, earth: 1, metal: 1, water: 1 },
    luckyItem: '파란색 팔찌',
    luckyPlace: '동국대 팔정도',
    compatibilities: [],
  };
}

async function mockCreateResult(input: ResultRequestInput): Promise<ApiOutcome<Result>> {
  const result = buildMockResult(input);
  mockResults.set(result.resultId, result);
  mockInputs.set(result.resultId, { ...input, isLeapMonth: input.isLeapMonth ?? false });
  return { ok: true, data: result };
}

async function mockGetResult(resultId: string): Promise<ApiOutcome<Result>> {
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
// 호출하는 쪽(route action)이 로딩 UX를 맡는다. 응답의 compatibilities 는 항상 빈 배열이다.
export async function createResult(input: ResultRequestInput): Promise<ApiOutcome<Result>> {
  const body = resultRequestSchema.parse(input); // 호출자(내부 코드)의 모양 실수를 개발 중 바로 잡는다
  const outcome = isMockEnabled()
    ? await mockCreateResult(body)
    : await request({ method: 'POST', path: '/results', body }, resultSchema);
  // 만든 결과를 이 브라우저의 '내 결과'로 기억한다 — 결과 화면 가드가 주소의 id 와 비교한다
  // (ADR-20260914-result-ownership-in-browser). 목·실제 응답이 같은 경로로 쓴다.
  if (outcome.ok) writeSession(outcome.data.resultId);
  return outcome;
}

// GET /results/{resultId} — 본인 결과 재방문 조회(FR-3, FR-8). 트래픽이 가장 몰리는 경로다.
// 백엔드가 모르는 결과라고 답하면 보관된 '내 결과'를 비운다 — 안 그러면 이 브라우저는 죽은 id 로
// 계속 404 를 받는다(ADR-20260914-result-ownership-in-browser).
export async function getResult(resultId: string): Promise<ApiOutcome<Result>> {
  if (isMockEnabled()) return mockGetResult(resultId);
  const outcome = await request({ method: 'GET', path: `/results/${resultId}` }, resultSchema);
  if (!outcome.ok && outcome.error.kind === 'api' && outcome.error.code === 'RESULT_NOT_FOUND') {
    forgetSession(resultId);
  }
  return outcome;
}

// GET /results/{resultId}/input — 결과를 만들 때 넣은 입력값(FR-25 소개팅 프로필 (1/2) 채움).
export async function getResultInput(resultId: string): Promise<ApiOutcome<ResultInput>> {
  if (isMockEnabled()) {
    const found = mockInputs.get(resultId);
    if (found) return { ok: true, data: found };
    return {
      ok: false,
      error: { kind: 'api', code: 'RESULT_NOT_FOUND', message: '점지된 결과를 찾을 수 없어요.' },
    };
  }
  return request({ method: 'GET', path: `/results/${resultId}/input` }, resultInputSchema);
}

// GET /me/result — 계정에 연결된 내 결과(FR-21). 이 브라우저에 세션이 없어도(기기 변경·저장소 삭제) 계정 사주를
// 찾는다. 받은 resultId 를 세션에 다시 보관해 이후 기존 API 를 그대로 쓴다(openapi getMyResult). 없으면 404.
export async function getMyResult(): Promise<ApiOutcome<Result>> {
  const outcome = isMockEnabled()
    ? await mockGetMyResult()
    : await request({ method: 'GET', path: '/me/result' }, resultSchema);
  if (outcome.ok) writeSession(outcome.data.resultId);
  return outcome;
}

async function mockGetMyResult(): Promise<ApiOutcome<Result>> {
  const resultId = readMockAccountResultId();
  if (resultId === null) {
    return {
      ok: false,
      error: { kind: 'api', code: 'RESULT_NOT_FOUND', message: '점지된 결과를 찾을 수 없어요.' },
    };
  }
  return mockGetResult(resultId);
}
