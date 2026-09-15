import type { LoaderFunctionArgs } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';

import { markShareJoined } from '@/api/joinedShares';
import type { SharedResult } from '@/api/schema/share';
import { writeSession } from '@/api/session';

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

test('내 결과가 없으면 링크 주인 닉네임만 돌려준다', async () => {
  getSharedResultMock.mockResolvedValue({ ok: true, data: owner });

  expect(await shareInputLoader(args())).toEqual({ ownerNickname: '달빛토끼' });
});

test('내 결과가 있고 이 탭에서 이 링크로 궁합을 만든 적이 없으면 입력 없이 궁합을 만들어 지도로 보낸다(replace)', async () => {
  writeSession(MY_RESULT_ID);
  createCompatibilityMock.mockResolvedValue({
    ok: true,
    data: { score: 93, tier: 'GUIIN', originNickname: '달빛토끼', guestNickname: '나' },
  });

  await expect(shareInputLoader(args())).rejects.toSatisfy(
    (response: Response) =>
      response.headers.get('Location') === `/s/${SHARE_ID}/map` &&
      response.headers.has('X-Remix-Replace'),
  );
  expect(createCompatibilityMock).toHaveBeenCalledWith(SHARE_ID, MY_RESULT_ID);
  expect(getSharedResultMock).not.toHaveBeenCalled();
});

test('입력을 건너뛴 궁합 생성이 연결 문제로 실패하면 재시도 주소로 보낸다', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  writeSession(MY_RESULT_ID);
  createCompatibilityMock.mockResolvedValue({ ok: false, error: { kind: 'network' } });

  await expect(shareInputLoader(args())).rejects.toSatisfy(
    (response: Response) => response.headers.get('Location') === `/s/${SHARE_ID}/join`,
  );
});

test('이 탭에서 이미 궁합을 만든 링크로 돌아오면 입력 폼을 보인다', async () => {
  writeSession(MY_RESULT_ID);
  markShareJoined(SHARE_ID);
  getSharedResultMock.mockResolvedValue({ ok: true, data: owner });

  expect(await shareInputLoader(args())).toEqual({ ownerNickname: '달빛토끼' });
});

test('없는 링크는 404 를 던진다', async () => {
  getSharedResultMock.mockResolvedValue({
    ok: false,
    error: { kind: 'api', code: 'RESULT_NOT_FOUND', message: '없음' },
  });

  await expect(shareInputLoader(args())).rejects.toMatchObject({ status: 404 });
});
