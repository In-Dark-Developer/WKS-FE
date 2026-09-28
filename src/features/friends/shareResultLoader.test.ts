import type { LoaderFunctionArgs } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';

import { markShareJoined } from '@/api/joinedShares';
import type { SharedResult } from '@/api/schema/share';
import { writeSession } from '@/api/session';

const { getSharedResultMock, getReasonMock } = vi.hoisted(() => ({
  getSharedResultMock: vi.fn(),
  getReasonMock: vi.fn(),
}));
vi.mock('@/api/shares', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/shares')>();
  return { ...actual, getSharedResult: getSharedResultMock };
});
vi.mock('@/api/compatibilities', () => ({ getCompatibilityReason: getReasonMock }));

import { shareResultLoader } from './shareResultLoader';

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
  elements: { wood: 3, fire: 2, earth: 1, metal: 1, water: 1 },
  luckyItem: '파란색 팔찌',
  luckyPlace: '팔정도',
  compatibilities: [
    { id: 3, nickname: '민지', score: 95, tier: 'GUIIN', createdAt: '2026-09-27T01:00:00Z' },
    { id: 7, nickname: '보살', score: 80, tier: 'CHALTTEOK', createdAt: '2026-09-27T02:00:00Z' },
  ],
};

function args(): LoaderFunctionArgs {
  return {
    request: new Request(`http://test/s/${SHARE_ID}/result`),
    params: { shareId: SHARE_ID },
    context: {},
    url: new URL(`http://test/s/${SHARE_ID}/result`),
    pattern: '/s/:shareId/result',
  };
}

afterEach(() => {
  getSharedResultMock.mockReset();
  getReasonMock.mockReset();
  localStorage.clear();
  sessionStorage.clear();
});

test('이 탭에서 만든 궁합을 주인 지도에서 찾아 순위와 이유를 준다 (FR-6)', async () => {
  writeSession(MY_RESULT_ID);
  markShareJoined(SHARE_ID, 7);
  getSharedResultMock.mockResolvedValue({ ok: true, data: owner });
  getReasonMock.mockResolvedValue({
    ok: true,
    data: { why: '왜', together: '함께', conflict: '다툼' },
  });

  const view = await shareResultLoader(args());

  expect(view).toMatchObject({
    ownerNickname: '달빛토끼',
    mine: { nickname: '보살', score: 80, tier: 'CHALTTEOK', compatibilityId: 7 },
    myRank: 2,
    myResultId: MY_RESULT_ID,
  });
  expect(getReasonMock).toHaveBeenCalledWith(7);
  await expect(view.reason).resolves.toEqual({ why: '왜', together: '함께', conflict: '다툼' });
});

test('이 탭의 궁합 기록이 없으면 전체 지도로 물러난다', async () => {
  writeSession(MY_RESULT_ID);
  markShareJoined(SHARE_ID);

  await expect(shareResultLoader(args())).rejects.toSatisfy(
    (response: Response) => response.headers.get('Location') === `/s/${SHARE_ID}/map`,
  );
  expect(getSharedResultMock).not.toHaveBeenCalled();
});

test('주인 지도에 그 궁합이 없어도 전체 지도로 물러난다', async () => {
  writeSession(MY_RESULT_ID);
  markShareJoined(SHARE_ID, 99);
  getSharedResultMock.mockResolvedValue({ ok: true, data: owner });

  await expect(shareResultLoader(args())).rejects.toSatisfy(
    (response: Response) => response.headers.get('Location') === `/s/${SHARE_ID}/map`,
  );
});

test('내 결과가 없으면 공유 링크 입력으로 보낸다 (FR-18)', async () => {
  await expect(shareResultLoader(args())).rejects.toSatisfy(
    (response: Response) => response.headers.get('Location') === `/s/${SHARE_ID}`,
  );
});
