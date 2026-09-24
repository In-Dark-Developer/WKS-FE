import type { LoaderFunctionArgs } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';

import { markShareJoined } from '@/api/joinedShares';
import type { SharedResult } from '@/api/schema/share';
import { readSession, writeSession } from '@/api/session';

const { getSharedResultMock, createCompatibilityMock } = vi.hoisted(() => ({
  getSharedResultMock: vi.fn(),
  createCompatibilityMock: vi.fn(),
}));
vi.mock('@/api/shares', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/shares')>();
  return {
    ...actual,
    getSharedResult: getSharedResultMock,
    createCompatibility: createCompatibilityMock,
  };
});

import { shareInputLoader } from './shareInputLoader';

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
  compatibilities: [],
};

function args(): LoaderFunctionArgs {
  return {
    request: new Request(`http://test/s/${SHARE_ID}`),
    params: { shareId: SHARE_ID },
    context: {},
    url: new URL(`http://test/s/${SHARE_ID}`),
    pattern: '/s/:shareId',
  };
}

afterEach(() => {
  getSharedResultMock.mockReset();
  createCompatibilityMock.mockReset();
  localStorage.clear();
  sessionStorage.clear();
  vi.restoreAllMocks();
});

test('내 결과가 없으면 고르지 않고 링크 주인 닉네임으로 입력 폼을 보인다', async () => {
  getSharedResultMock.mockResolvedValue({ ok: true, data: owner });

  expect(await shareInputLoader(args())).toEqual({
    ownerNickname: '달빛토끼',
    canReusePrevious: false,
  });
});

test('내 결과가 있고 이 탭에서 이 링크로 궁합을 만든 적이 없으면 궁합을 만들지 않고 고르게 한다', async () => {
  writeSession(MY_RESULT_ID);
  getSharedResultMock.mockResolvedValue({ ok: true, data: owner });

  expect(await shareInputLoader(args())).toEqual({
    ownerNickname: '달빛토끼',
    canReusePrevious: true,
  });
  expect(createCompatibilityMock).not.toHaveBeenCalled();
  // 새로 작성하기로 가도 보관된 내 결과는 그대로다(FR-23).
  expect(readSession()).toEqual({ resultId: MY_RESULT_ID });
});

test('이 탭에서 이미 궁합을 만든 링크로 돌아오면 고르지 않고 입력 폼을 보인다', async () => {
  writeSession(MY_RESULT_ID);
  markShareJoined(SHARE_ID);
  getSharedResultMock.mockResolvedValue({ ok: true, data: owner });

  expect(await shareInputLoader(args())).toEqual({
    ownerNickname: '달빛토끼',
    canReusePrevious: false,
  });
});

test('없는 링크는 404 를 던진다', async () => {
  writeSession(MY_RESULT_ID);
  getSharedResultMock.mockResolvedValue({
    ok: false,
    error: { kind: 'api', code: 'RESULT_NOT_FOUND', message: '없음' },
  });

  await expect(shareInputLoader(args())).rejects.toMatchObject({ status: 404 });
  expect(createCompatibilityMock).not.toHaveBeenCalled();
});
