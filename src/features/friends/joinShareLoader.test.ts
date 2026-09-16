import type { LoaderFunctionArgs } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';

import { hasJoinedShare } from '@/api/joinedShares';
import { readSession, writeSession } from '@/api/session';

const { createCompatibilityMock, getSharedResultMock } = vi.hoisted(() => ({
  createCompatibilityMock: vi.fn(),
  getSharedResultMock: vi.fn(),
}));
vi.mock('@/api/shares', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/shares')>();
  return {
    ...actual,
    createCompatibility: createCompatibilityMock,
    getSharedResult: getSharedResultMock,
  };
});

import { joinShareLoader } from './joinShareLoader';

const SHARE_ID = '5a951b51-21d5-4601-91b9-560de47aaaca';
const MY_RESULT_ID = '90585fc0-7e6a-4e6b-8de7-47cd169c60b5';

function args(): LoaderFunctionArgs {
  return {
    request: new Request(`http://test/s/${SHARE_ID}/join`),
    params: { shareId: SHARE_ID },
    context: {},
    url: new URL(`http://test/s/${SHARE_ID}/join`),
    pattern: '/s/:shareId/join',
  };
}

afterEach(() => {
  createCompatibilityMock.mockReset();
  getSharedResultMock.mockReset();
  localStorage.clear();
  sessionStorage.clear();
  vi.restoreAllMocks();
});

test('내 결과가 없으면 궁합을 부르지 않고 공유 링크 입력으로 보낸다', async () => {
  const response = await joinShareLoader(args());

  expect(response.headers.get('Location')).toBe(`/s/${SHARE_ID}`);
  expect(createCompatibilityMock).not.toHaveBeenCalled();
});

test('내 결과로 궁합을 만들면 이 탭의 기록에 남기고 친구의 궁합 지도로 보낸다', async () => {
  writeSession(MY_RESULT_ID);
  createCompatibilityMock.mockResolvedValue({
    ok: true,
    data: { score: 93, tier: 'GUIIN', originNickname: '주인', guestNickname: '나' },
  });

  const response = await joinShareLoader(args());

  expect(createCompatibilityMock).toHaveBeenCalledWith(SHARE_ID, MY_RESULT_ID);
  expect(response.headers.get('Location')).toBe(`/s/${SHARE_ID}/map`);
  expect(hasJoinedShare(SHARE_ID)).toBe(true);
});

test('자기 링크면 궁합 없이 내 결과로 보낸다', async () => {
  writeSession(MY_RESULT_ID);
  createCompatibilityMock.mockResolvedValue({
    ok: false,
    error: { kind: 'api', code: 'SELF_COMPATIBILITY', message: '본인' },
  });

  const response = await joinShareLoader(args());

  expect(response.headers.get('Location')).toBe(`/reading/${MY_RESULT_ID}`);
  expect(hasJoinedShare(SHARE_ID)).toBe(false);
});

const notFound = {
  ok: false,
  error: { kind: 'api', code: 'RESULT_NOT_FOUND', message: '없음' },
} as const;

test('없는 링크면 404 를 던지고 내 결과는 그대로 둔다', async () => {
  writeSession(MY_RESULT_ID);
  createCompatibilityMock.mockResolvedValue(notFound);
  getSharedResultMock.mockResolvedValue(notFound);

  await expect(joinShareLoader(args())).rejects.toMatchObject({ status: 404 });
  expect(readSession()?.resultId).toBe(MY_RESULT_ID);
});

test('링크는 살아 있는데 내 결과가 없으면 보관된 결과를 비우고 사주 입력으로 보낸다', async () => {
  writeSession(MY_RESULT_ID);
  createCompatibilityMock.mockResolvedValue(notFound);
  getSharedResultMock.mockResolvedValue({ ok: true, data: {} });

  const response = await joinShareLoader(args());

  expect(readSession()).toBeNull();
  expect(response.headers.get('Location')).toBe(`/s/${SHARE_ID}`);
});

test('링크 확인이 연결 문제로 실패하면 내 결과를 두고 재시도 오류(503)로 간다', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  writeSession(MY_RESULT_ID);
  createCompatibilityMock.mockResolvedValue(notFound);
  getSharedResultMock.mockResolvedValue({ ok: false, error: { kind: 'network' } });

  await expect(joinShareLoader(args())).rejects.toMatchObject({ status: 503 });
  expect(readSession()?.resultId).toBe(MY_RESULT_ID);
});

test('연결 실패는 원인을 콘솔에 남기고 503 을 던진다', async () => {
  const log = vi.spyOn(console, 'error').mockImplementation(() => {});
  writeSession(MY_RESULT_ID);
  createCompatibilityMock.mockResolvedValue({ ok: false, error: { kind: 'network' } });

  await expect(joinShareLoader(args())).rejects.toMatchObject({ status: 503 });
  expect(hasJoinedShare(SHARE_ID)).toBe(false);
  expect(log).toHaveBeenCalled();
});
