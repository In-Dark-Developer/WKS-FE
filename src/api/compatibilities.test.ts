import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { getCompatibilityReason } from './compatibilities';

// request() 는 그대로 두고 fetch 만 바꾼다 — 봉투 파싱까지 거쳐 같은 결과가 되는지 본다(shares.test.ts 와 같다).
const fetchMock = vi.fn<typeof fetch>();

function respond(status: number, body: unknown) {
  fetchMock.mockResolvedValueOnce(
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }),
  );
}

beforeEach(() => {
  vi.stubEnv('VITE_API_MOCK', 'false');
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

test('궁합 ID 로 이유 세 문단을 받는다', async () => {
  respond(200, { success: true, data: { why: '왜', together: '함께', conflict: '다툼' } });

  const outcome = await getCompatibilityReason(12);

  expect(outcome).toEqual({ ok: true, data: { why: '왜', together: '함께', conflict: '다툼' } });
  expect(String(fetchMock.mock.calls[0]?.[0])).toMatch(/\/compatibilities\/12\/reason$/);
});

test('생성 실패(503 LLM_UNAVAILABLE)는 다시 부를 수 있는 오류로 돌려준다', async () => {
  respond(503, {
    success: false,
    error: { code: 'LLM_UNAVAILABLE', message: '해석 서비스를 일시적으로 사용할 수 없습니다.' },
  });

  const outcome = await getCompatibilityReason(12);

  expect(outcome).toMatchObject({ ok: false, error: { kind: 'api', code: 'LLM_UNAVAILABLE' } });
});

test('없는 궁합은 COMPATIBILITY_NOT_FOUND 로 온다', async () => {
  respond(404, {
    success: false,
    error: { code: 'COMPATIBILITY_NOT_FOUND', message: '궁합을 찾을 수 없습니다.' },
  });

  const outcome = await getCompatibilityReason(99);

  expect(outcome).toMatchObject({
    ok: false,
    error: { kind: 'api', code: 'COMPATIBILITY_NOT_FOUND' },
  });
});
