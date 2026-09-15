import { request, type ApiOutcome } from './client';
import {
  compatibilityRequestSchema,
  compatibilitySchema,
  sharedResultSchema,
  type Compatibility,
  type SharedResult,
} from './schema/share';

export type { Compatibility, SharedResult } from './schema/share';

// 백엔드 없이 개발·테스트할 때 `VITE_API_MOCK=true` 면 이 파일 안 목 응답을 돌려준다(results.ts 와 같은 규칙).
const isMockEnabled = () => import.meta.env.VITE_API_MOCK === 'true';

// 목 모드의 링크 주인은 한 명이다. 어떤 shareId 로 들어와도 이 주인으로 본다 — 목 결과(results.ts)의
// shareId 는 매번 새로 만들어져 주인을 찾을 수 없어서다. 주인 결과 id 로 궁합을 요청하면 자기 링크다.
export const MOCK_OWNER_RESULT_ID = '0f0e0d0c-0000-4000-8000-000000000001';

const mockOwner: SharedResult = {
  nickname: '달빛토끼',
  zodiac: 'RABBIT',
  destiny: { title: '점지된 인연', description: '오늘 만난 인연이 오래갈 운명이에요.' },
  fortunes: [
    { category: 'MARRIAGE', grade: 'S', content: '좋은 배필을 만날 운명이에요.' },
    { category: 'CHILDREN', grade: 'A', content: '자녀와의 인연이 따뜻해요.' },
    { category: 'LOVE', grade: 'A+', content: '올해 인연운이 아주 좋아요.' },
  ],
  luckyItem: '파란색 팔찌',
  luckyPlace: '동국대 팔정도',
  compatibilities: [],
};

// 백엔드 등급 구간(openapi CompatibilityTier) — 목 응답을 만들 때만 쓴다. 화면은 응답 tier 를 그대로 쓴다(FR-7).
function mockTier(score: number): Compatibility['tier'] {
  if (score >= 90) return 'GUIIN';
  if (score >= 75) return 'CHALTTEOK';
  if (score >= 61) return 'BEOT';
  return 'SEUCHIM';
}

// 같은 두 id 는 항상 같은 점수 — 백엔드의 '이미 있는 조합은 재계산 없이 같은 값'을 흉내 낸다.
function mockScore(shareId: string, guestResultId: string): number {
  let hash = 0;
  for (const char of `${shareId}:${guestResultId}`) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash % 101;
}

function mockGetSharedResult(): ApiOutcome<SharedResult> {
  return { ok: true, data: mockOwner };
}

function mockCreateCompatibility(
  shareId: string,
  guestResultId: string,
): ApiOutcome<Compatibility> {
  if (guestResultId === MOCK_OWNER_RESULT_ID) {
    return {
      ok: false,
      error: {
        kind: 'api',
        code: 'SELF_COMPATIBILITY',
        message: '자기 자신과는 궁합을 볼 수 없어요.',
      },
    };
  }
  const score = mockScore(shareId, guestResultId);
  return {
    ok: true,
    data: {
      score,
      tier: mockTier(score),
      originNickname: mockOwner.nickname,
      guestNickname: '방문자',
    },
  };
}

// shareId 는 공유 링크 주소에서 온 값이라 경로를 벗어나지 못하게 인코딩한다.
function sharePath(shareId: string): string {
  return `/shares/${encodeURIComponent(shareId)}`;
}

// GET /shares/{shareId} — 공유 링크로 들어온 방문자가 링크 주인을 확인한다(FR-14, FR-15).
// 없는 링크는 `{ kind: 'api', code: 'RESULT_NOT_FOUND' }`, 형식이 틀린 shareId 는 `INVALID_INPUT` 이다.
export async function getSharedResult(shareId: string): Promise<ApiOutcome<SharedResult>> {
  if (isMockEnabled()) return mockGetSharedResult();
  return request({ method: 'GET', path: sharePath(shareId) }, sharedResultSchema);
}

// POST /shares/{shareId}/compatibility — 방문자 결과로 링크 주인과의 궁합을 만든다(FR-6, FR-7, FR-14).
// 새 조합(201)과 이미 있는 조합(200, 같은 값)은 모두 성공이다 — 새로고침에 다시 불러도 점수가 같다.
// 링크 주인 자신이면 `SELF_COMPATIBILITY`. POST 라 재시도하지 않는다(client.ts).
export async function createCompatibility(
  shareId: string,
  guestResultId: string,
): Promise<ApiOutcome<Compatibility>> {
  const body = compatibilityRequestSchema.parse({ guestResultId }); // 호출자(내부 코드)의 실수를 개발 중 바로 잡는다
  if (isMockEnabled()) return mockCreateCompatibility(shareId, body.guestResultId);
  return request(
    { method: 'POST', path: `${sharePath(shareId)}/compatibility`, body },
    compatibilitySchema,
  );
}
