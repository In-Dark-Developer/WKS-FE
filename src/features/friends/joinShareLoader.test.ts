import type { LoaderFunctionArgs } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';

import { readPendingShare, writePendingShare } from '@/api/pendingShare';
import { writeSession } from '@/api/session';

const { createCompatibilityMock } = vi.hoisted(() => ({ createCompatibilityMock: vi.fn() }));
vi.mock('@/api/shares', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/shares')>();
  return { ...actual, createCompatibility: createCompatibilityMock };
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

function location(response: Response): string | null {
  return response.headers.get('Location');
}

afterEach(() => {
  createCompatibilityMock.mockReset();
  localStorage.clear();
  sessionStorage.clear();
  vi.restoreAllMocks();
});

test('내 결과가 없으면 궁합을 부르지 않고 shareId 를 보관한 채 사주 입력으로 보낸다', async () => {
  const response = await joinShareLoader(args());

  expect(location(response)).toBe('/');
  expect(createCompatibilityMock).not.toHaveBeenCalled();
  expect(readPendingShare()).toBe(SHARE_ID);
});

test('내 결과가 있으면 그 결과로 궁합을 만들고 보관값을 지운 뒤 내 결과로 보낸다', async () => {
  writeSession(MY_RESULT_ID);
  writePendingShare(SHARE_ID);
  createCompatibilityMock.mockResolvedValue({
    ok: true,
    data: { score: 93, tier: 'GUIIN', originNickname: '주인', guestNickname: '나' },
  });

  const response = await joinShareLoader(args());

  expect(createCompatibilityMock).toHaveBeenCalledWith(SHARE_ID, MY_RESULT_ID);
  expect(location(response)).toBe(`/reading/${MY_RESULT_ID}`);
  expect(readPendingShare()).toBeNull();
});

test('자기 링크면 궁합 없이 내 결과로 보낸다', async () => {
  writeSession(MY_RESULT_ID);
  writePendingShare(SHARE_ID);
  createCompatibilityMock.mockResolvedValue({
    ok: false,
    error: { kind: 'api', code: 'SELF_COMPATIBILITY', message: '본인' },
  });

  const response = await joinShareLoader(args());

  expect(location(response)).toBe(`/reading/${MY_RESULT_ID}`);
  expect(readPendingShare()).toBeNull();
});

test('없는 링크면 404 를 던지고 보관값을 지운다', async () => {
  writeSession(MY_RESULT_ID);
  writePendingShare(SHARE_ID);
  createCompatibilityMock.mockResolvedValue({
    ok: false,
    error: { kind: 'api', code: 'RESULT_NOT_FOUND', message: '없음' },
  });

  await expect(joinShareLoader(args())).rejects.toMatchObject({ status: 404 });
  expect(readPendingShare()).toBeNull();
});

test('연결 실패는 503 을 던지고 다시 시도할 수 있게 보관값을 남긴다', async () => {
  const log = vi.spyOn(console, 'error').mockImplementation(() => {});
  writeSession(MY_RESULT_ID);
  writePendingShare(SHARE_ID);
  createCompatibilityMock.mockResolvedValue({ ok: false, error: { kind: 'network' } });

  await expect(joinShareLoader(args())).rejects.toMatchObject({ status: 503 });
  expect(readPendingShare()).toBe(SHARE_ID);
  expect(log).toHaveBeenCalled();
});
