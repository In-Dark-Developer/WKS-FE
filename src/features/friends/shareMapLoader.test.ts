import type { LoaderFunctionArgs } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';

import { readPendingShare } from '@/api/pendingShare';
import type { SharedResult } from '@/api/schema/share';

const { getSharedResultMock } = vi.hoisted(() => ({ getSharedResultMock: vi.fn() }));
vi.mock('@/api/shares', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/shares')>();
  return { ...actual, getSharedResult: getSharedResultMock };
});

import { shareMapLoader } from './shareMapLoader';

const SHARE_ID = '5a951b51-21d5-4601-91b9-560de47aaaca';

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

function args(shareId: string | undefined): LoaderFunctionArgs {
  return {
    request: new Request(`http://test/s/${shareId ?? ''}`),
    params: { shareId },
    context: {},
    url: new URL(`http://test/s/${shareId ?? ''}`),
    pattern: '/s/:shareId',
  };
}

afterEach(() => {
  getSharedResultMock.mockReset();
  sessionStorage.clear();
  vi.restoreAllMocks();
});

test('링크 주인의 닉네임과 점수 높은 순 친구 목록만 돌려주고 shareId 를 보관한다', async () => {
  getSharedResultMock.mockResolvedValue({ ok: true, data: owner });

  const view = await shareMapLoader(args(SHARE_ID));

  expect(view).toEqual({
    shareId: SHARE_ID,
    nickname: '달빛토끼',
    friends: [
      { nickname: '서연', score: 92, tier: 'GUIIN' },
      { nickname: '민수', score: 61, tier: 'BEOT' },
    ],
  });
  expect(getSharedResultMock).toHaveBeenCalledWith(SHARE_ID);
  expect(readPendingShare()).toBe(SHARE_ID);
});

test('없는 링크는 404 를 던지고 shareId 를 보관하지 않는다', async () => {
  getSharedResultMock.mockResolvedValue({
    ok: false,
    error: { kind: 'api', code: 'RESULT_NOT_FOUND', message: '없음' },
  });

  await expect(shareMapLoader(args(SHARE_ID))).rejects.toMatchObject({ status: 404 });
  expect(readPendingShare()).toBeNull();
});

test('연결 실패는 원인을 콘솔에 남기고 503 을 던진다', async () => {
  const log = vi.spyOn(console, 'error').mockImplementation(() => {});
  getSharedResultMock.mockResolvedValue({ ok: false, error: { kind: 'network' } });

  await expect(shareMapLoader(args(SHARE_ID))).rejects.toMatchObject({ status: 503 });
  expect(log).toHaveBeenCalled();
});
