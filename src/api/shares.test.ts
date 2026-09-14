import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { MOCK_OWNER_RESULT_ID, createCompatibility, getSharedResult } from './shares';

// request() 를 가짜로 바꾸지 않고 fetch 만 바꾼다 — 201·200 이 client 의 봉투 파싱을 거쳐 같은
// 성공이 되는지까지 확인하기 위해서다.
const fetchMock = vi.fn<typeof fetch>();

const SHARE_ID = '7b91d26f-5678-4c2d-9e3f-fedcba654321';
const GUEST_ID = '3f2a9c1e-1234-4a1b-8c1a-abcdef123456';

const sharedResult = {
  nickname: '서연',
  zodiac: 'HORSE',
  destiny: { title: '사랑이 앞서 걷는 길', description: '설명' },
  fortunes: [
    { category: 'MARRIAGE', grade: 'SS', content: '결혼운' },
    { category: 'CHILDREN', grade: 'A+', content: '자녀운' },
    { category: 'LOVE', grade: 'B', content: '연애운' },
  ],
  luckyItem: '파란 부채',
  luckyPlace: '팔정도 앞',
  compatibilities: [],
};

const compatibility = { score: 92, tier: 'GUIIN', originNickname: '서연', guestNickname: '지현' };

function respond(status: number, body: unknown) {
  fetchMock.mockResolvedValueOnce(
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }),
  );
}

function calledUrl(index = 0): string {
  return String(fetchMock.mock.calls[index]?.[0]);
}

beforeEach(() => {
  // 로컬 `.env` 의 VITE_API_MOCK=true 와 무관하게 기본은 실제 모드다(results.test.ts 와 같다).
  vi.stubEnv('VITE_API_MOCK', 'false');
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

test('getSharedResult 는 GET /shares/{shareId} 로 주인의 공개 결과를 받는다', async () => {
  respond(200, { success: true, data: sharedResult });

  const outcome = await getSharedResult(SHARE_ID);

  expect(calledUrl()).toMatch(new RegExp(`/shares/${SHARE_ID}$`));
  expect(fetchMock.mock.calls[0]?.[1]?.method).toBe('GET');
  expect(outcome).toEqual({ ok: true, data: sharedResult });
});

test('없는 링크는 RESULT_NOT_FOUND 로 구분된다', async () => {
  respond(404, {
    success: false,
    error: { code: 'RESULT_NOT_FOUND', message: '사주 결과를 찾을 수 없습니다.' },
  });

  const outcome = await getSharedResult(SHARE_ID);

  expect(outcome).toEqual({
    ok: false,
    error: { kind: 'api', code: 'RESULT_NOT_FOUND', message: '사주 결과를 찾을 수 없습니다.' },
  });
});

test('주소의 shareId 는 인코딩돼 다른 경로로 새지 않는다', async () => {
  respond(400, {
    success: false,
    error: { code: 'INVALID_INPUT', message: '입력값이 올바르지 않습니다.' },
  });

  await getSharedResult('../signups');

  expect(calledUrl()).toMatch(/\/shares\/\.\.%2Fsignups$/);
});

test('공유 결과 응답이 계약과 다르면 schema 실패다', async () => {
  respond(200, { success: true, data: { ...sharedResult, zodiac: 'CAT' } });

  expect(await getSharedResult(SHARE_ID)).toEqual({ ok: false, error: { kind: 'schema' } });
});

test('createCompatibility 는 POST /shares/{shareId}/compatibility 에 guestResultId 를 보낸다', async () => {
  respond(201, { success: true, data: compatibility });

  const outcome = await createCompatibility(SHARE_ID, GUEST_ID);

  expect(calledUrl()).toMatch(new RegExp(`/shares/${SHARE_ID}/compatibility$`));
  expect(fetchMock.mock.calls[0]?.[1]?.method).toBe('POST');
  expect(fetchMock.mock.calls[0]?.[1]?.body).toBe(JSON.stringify({ guestResultId: GUEST_ID }));
  expect(outcome).toEqual({ ok: true, data: compatibility });
});

test('이미 있는 조합(200)도 새 조합(201)과 같은 성공이다', async () => {
  respond(201, { success: true, data: compatibility });
  respond(200, { success: true, data: compatibility });

  const created = await createCompatibility(SHARE_ID, GUEST_ID);
  const again = await createCompatibility(SHARE_ID, GUEST_ID);

  expect(again).toEqual(created);
});

test('자기 링크로 요청하면 SELF_COMPATIBILITY 로 구분된다', async () => {
  respond(400, {
    success: false,
    error: { code: 'SELF_COMPATIBILITY', message: '자기 자신과는 궁합을 볼 수 없습니다.' },
  });

  const outcome = await createCompatibility(SHARE_ID, GUEST_ID);

  expect(outcome.ok === false && outcome.error.kind === 'api' && outcome.error.code).toBe(
    'SELF_COMPATIBILITY',
  );
});

test('궁합 요청은 네트워크 실패에도 재시도하지 않는다', async () => {
  fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));

  const outcome = await createCompatibility(SHARE_ID, GUEST_ID);

  expect(outcome).toEqual({ ok: false, error: { kind: 'network' } });
  expect(fetchMock).toHaveBeenCalledTimes(1);
});

test('guestResultId 가 UUID 가 아니면 요청 전에 던진다', async () => {
  await expect(createCompatibility(SHARE_ID, 'not-a-uuid')).rejects.toThrow();
  expect(fetchMock).not.toHaveBeenCalled();
});

test('목 모드는 백엔드를 부르지 않고 주인의 공개 결과를 준다', async () => {
  vi.stubEnv('VITE_API_MOCK', 'true');

  const outcome = await getSharedResult(SHARE_ID);

  expect(fetchMock).not.toHaveBeenCalled();
  expect(outcome.ok && outcome.data.nickname).toBe('달빛토끼');
});

test('목 모드의 궁합은 같은 조합이면 같은 점수이고 등급이 점수 구간과 맞다', async () => {
  vi.stubEnv('VITE_API_MOCK', 'true');

  const first = await createCompatibility(SHARE_ID, GUEST_ID);
  const second = await createCompatibility(SHARE_ID, GUEST_ID);

  expect(second).toEqual(first);
  if (!first.ok) throw new Error('unreachable');
  const { score, tier } = first.data;
  const expected =
    score >= 90 ? 'GUIIN' : score >= 75 ? 'CHALTTEOK' : score >= 61 ? 'BEOT' : 'SEUCHIM';
  expect(tier).toBe(expected);
  expect(fetchMock).not.toHaveBeenCalled();
});

test('목 모드에서 주인 결과로 궁합을 요청하면 SELF_COMPATIBILITY', async () => {
  vi.stubEnv('VITE_API_MOCK', 'true');

  const outcome = await createCompatibility(SHARE_ID, MOCK_OWNER_RESULT_ID);

  expect(outcome.ok === false && outcome.error.kind === 'api' && outcome.error.code).toBe(
    'SELF_COMPATIBILITY',
  );
});
