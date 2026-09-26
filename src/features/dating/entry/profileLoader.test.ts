import { afterEach, expect, test, vi } from 'vitest';

const { getResultInputMock, getMyResultMock } = vi.hoisted(() => ({
  getResultInputMock: vi.fn(),
  getMyResultMock: vi.fn(),
}));
vi.mock('@/api/results', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/results')>();
  return { ...actual, getResultInput: getResultInputMock, getMyResult: getMyResultMock };
});

import { clearSession, writeSession } from '@/api/session';

import { datingProfileLoader, toSajuStepValues } from './profileLoader';

const RESULT_ID = '3f2a9c1e-1111-4111-8111-111111111111';
const me = { memberId: 1, hasResult: true, hasDatingProfile: false, threadBalance: 0 };
const storedInput = {
  nickname: '달빛토끼',
  calendarType: 'LUNAR',
  birthDate: '2003-05-17',
  isLeapMonth: true,
  birthTime: '06:30',
  gender: 'FEMALE',
} as const;

afterEach(() => {
  getResultInputMock.mockReset();
  getMyResultMock.mockReset();
  clearSession();
  vi.restoreAllMocks();
});

test('결과 입력값을 폼 값(숫자 8자리 · 시진 칸)으로 옮긴다', () => {
  expect(toSajuStepValues(storedInput)).toEqual({
    gender: 'FEMALE',
    calendarType: 'LUNAR',
    isLeapMonth: true,
    birthDate: '20030517',
    birthTime: '06:30',
    birthTimeUnknown: false,
    nickname: '달빛토끼',
  });
  // 모르는 시간은 '몰라요', 시진 칸에 없는 시각은 비워 다시 고르게 한다.
  expect(toSajuStepValues({ ...storedInput, birthTime: null })).toMatchObject({
    birthTime: null,
    birthTimeUnknown: true,
  });
  expect(toSajuStepValues({ ...storedInput, birthTime: '14:00' })).toMatchObject({
    birthTime: null,
    birthTimeUnknown: false,
  });
});

test('사주가 없으면 (1/2) 부터 시작한다', async () => {
  await expect(datingProfileLoader({ ...me, hasResult: false })).resolves.toEqual({
    initialStep: 1,
    resultId: null,
  });
  expect(getResultInputMock).not.toHaveBeenCalled();
  expect(getMyResultMock).not.toHaveBeenCalled();
});

test('사주가 있으면 (2/2) 부터 시작하고 (1/2) 는 그 사주로 채운다', async () => {
  writeSession(RESULT_ID);
  getResultInputMock.mockResolvedValue({ ok: true, data: storedInput });

  await expect(datingProfileLoader(me)).resolves.toEqual({
    initialStep: 2,
    resultId: RESULT_ID,
    saju: toSajuStepValues(storedInput),
  });
  expect(getResultInputMock).toHaveBeenCalledWith(RESULT_ID);
  expect(getMyResultMock).not.toHaveBeenCalled();
});

test('이 브라우저에 세션이 없어도 계정에 사주가 있으면 불러와 (2/2) 부터 시작한다', async () => {
  getMyResultMock.mockResolvedValue({ ok: true, data: { resultId: RESULT_ID } });
  getResultInputMock.mockResolvedValue({ ok: true, data: storedInput });

  await expect(datingProfileLoader(me)).resolves.toEqual({
    initialStep: 2,
    resultId: RESULT_ID,
    saju: toSajuStepValues(storedInput),
  });
  expect(getResultInputMock).toHaveBeenCalledWith(RESULT_ID);
});

test('계정 사주를 불러오지 못하면 (1/2) 부터 받는다', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  getMyResultMock.mockResolvedValue({
    ok: false,
    error: { kind: 'api', code: 'RESULT_NOT_FOUND', message: '없음' },
  });

  await expect(datingProfileLoader(me)).resolves.toEqual({ initialStep: 1, resultId: null });
  expect(getResultInputMock).not.toHaveBeenCalled();
});

test('입력값을 못 읽으면 막지 않고 (1/2) 부터 다시 받는다', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  writeSession(RESULT_ID);
  getResultInputMock.mockResolvedValue({ ok: false, error: { kind: 'network' } });

  await expect(datingProfileLoader(me)).resolves.toEqual({ initialStep: 1, resultId: null });
});

test('이미 등록했으면 Top 3 로 보낸다', async () => {
  const thrown: unknown = await datingProfileLoader({ ...me, hasDatingProfile: true }).catch(
    (error: unknown) => error,
  );

  expect(thrown).toBeInstanceOf(Response);
  // redirect() 는 Response 를 던진다 — 가는 곳은 Location 헤더에 있다.
  expect((thrown as Response).headers.get('Location')).toBe('/dating/cards');
});
