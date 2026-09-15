import type { LoaderFunctionArgs } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';

import type { SharedResult } from '@/api/schema/share';
import { writeSession } from '@/api/session';

const { getSharedResultMock } = vi.hoisted(() => ({ getSharedResultMock: vi.fn() }));
vi.mock('@/api/shares', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/shares')>();
  return { ...actual, getSharedResult: getSharedResultMock };
});

import { shareMapLoader } from './shareMapLoader';

const SHARE_ID = '5a951b51-21d5-4601-91b9-560de47aaaca';
const MY_RESULT_ID = '90585fc0-7e6a-4e6b-8de7-47cd169c60b5';

const owner: SharedResult = {
  nickname: '달빛토끼',
  zodiac: 'RABBIT',
  destiny: { title: '점지된 인연', description: '설명' },
  fortunes: [
    { category: 'MARRIAGE', grade: 'S', content: '결혼운' },
    { category: 'CHILDREN', grade: 'A', content: '자녀운' },
    { category: 'LOVE', grade: 'A+', content: '연애운' },
  ],
  luckyItem: '파란색 팔찌',
  luckyPlace: '팔정도',
  compatibilities: [
    { nickname: '민수', score: 61, tier: 'BEOT', createdAt: '2026-09-15T02:00:00Z' },
    { nickname: '서연', score: 92, tier: 'GUIIN', createdAt: '2026-09-15T01:00:00Z' },
  ],
};

function args(): LoaderFunctionArgs {
  return {
    request: new Request(`http://test/s/${SHARE_ID}/map`),
    params: { shareId: SHARE_ID },
    context: {},
    url: new URL(`http://test/s/${SHARE_ID}/map`),
    pattern: '/s/:shareId/map',
  };
}

afterEach(() => {
  getSharedResultMock.mockReset();
  localStorage.clear();
  vi.restoreAllMocks();
});

test('내 결과가 없으면 공유 링크 입력으로 보낸다', async () => {
  await expect(shareMapLoader(args())).rejects.toSatisfy(
    (response: Response) => response.headers.get('Location') === `/s/${SHARE_ID}`,
  );
  expect(getSharedResultMock).not.toHaveBeenCalled();
});

test('링크 주인의 닉네임·점수 높은 순 친구 목록·내 resultId 만 돌려준다', async () => {
  writeSession(MY_RESULT_ID);
  getSharedResultMock.mockResolvedValue({ ok: true, data: owner });

  expect(await shareMapLoader(args())).toEqual({
    shareId: SHARE_ID,
    nickname: '달빛토끼',
    friends: [
      { nickname: '서연', score: 92, tier: 'GUIIN' },
      { nickname: '민수', score: 61, tier: 'BEOT' },
    ],
    myResultId: MY_RESULT_ID,
  });
});

test('없는 링크는 404, 연결 실패는 503 을 던진다', async () => {
  writeSession(MY_RESULT_ID);
  vi.spyOn(console, 'error').mockImplementation(() => {});
  getSharedResultMock.mockResolvedValueOnce({
    ok: false,
    error: { kind: 'api', code: 'RESULT_NOT_FOUND', message: '없음' },
  });
  await expect(shareMapLoader(args())).rejects.toMatchObject({ status: 404 });

  getSharedResultMock.mockResolvedValueOnce({ ok: false, error: { kind: 'network' } });
  await expect(shareMapLoader(args())).rejects.toMatchObject({ status: 503 });
});
