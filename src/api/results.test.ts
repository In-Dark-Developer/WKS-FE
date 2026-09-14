import { afterEach, beforeEach, expect, test, vi } from 'vitest';

const { requestMock } = vi.hoisted(() => ({ requestMock: vi.fn() }));
vi.mock('./client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./client')>();
  return { ...actual, request: requestMock };
});

import { createResult, getResult, type ResultRequestInput } from './results';
import { clearSession, readSession } from './session';

const input: ResultRequestInput = {
  nickname: '보살',
  calendarType: 'SOLAR',
  birthDate: '2002-01-01',
  birthTime: null,
  gender: 'MALE',
};

beforeEach(() => {
  // 로컬 `.env`(개발 편의용 VITE_API_MOCK=true)가 있어도 이 파일의 기본값은 항상 "실제 모드"다 —
  // 목 모드가 필요한 테스트는 각자 vi.stubEnv('VITE_API_MOCK', 'true')로 켠다.
  vi.stubEnv('VITE_API_MOCK', 'false');
});

afterEach(() => {
  requestMock.mockReset();
  vi.unstubAllEnvs();
  clearSession();
  localStorage.clear();
});

const RESULT_ID = '3f2a9c1e-1111-4111-8111-111111111111';

test('createResult 는 POST /results 로 계약대로의 본문을 보낸다', async () => {
  requestMock.mockResolvedValue({ ok: true, data: { resultId: RESULT_ID } });

  const result = await createResult(input);

  expect(requestMock).toHaveBeenCalledWith(
    { method: 'POST', path: '/results', body: input },
    expect.anything(),
  );
  expect(result).toEqual({ ok: true, data: { resultId: RESULT_ID } });
});

test('createResult 가 성공하면 응답의 resultId 를 내 결과로 저장한다', async () => {
  requestMock.mockResolvedValue({ ok: true, data: { resultId: RESULT_ID } });

  await createResult(input);

  expect(readSession()).toEqual({ resultId: RESULT_ID });
});

test('createResult 가 실패하면 내 결과를 바꾸지 않는다', async () => {
  requestMock.mockResolvedValue({ ok: false, error: { kind: 'network' } });

  await createResult(input);

  expect(readSession()).toBeNull();
});

test('getResult 는 GET /results/{id} 를 부른다', async () => {
  requestMock.mockResolvedValue({ ok: true, data: { resultId: 'r1', compatibilities: [] } });

  await getResult('r1');

  expect(requestMock).toHaveBeenCalledWith(
    { method: 'GET', path: '/results/r1' },
    expect.anything(),
  );
});

test('계약과 다른 모양의 입력은 개발 중 바로 던진다', async () => {
  await expect(
    createResult({ ...input, gender: 'unknown' as unknown as 'MALE' }),
  ).rejects.toThrow();
  expect(requestMock).not.toHaveBeenCalled();
});

test('VITE_API_MOCK=true 면 백엔드를 부르지 않고 목 결과를 돌려주며 그 resultId 를 저장한다', async () => {
  vi.stubEnv('VITE_API_MOCK', 'true');

  const created = await createResult(input);

  expect(requestMock).not.toHaveBeenCalled();
  if (!created.ok) throw new Error('unreachable');
  expect(readSession()).toEqual({ resultId: created.data.resultId });
});

test('목 모드에서 방금 만든 resultId 는 다시 조회된다', async () => {
  vi.stubEnv('VITE_API_MOCK', 'true');
  const created = await createResult(input);
  if (!created.ok) throw new Error('unreachable');

  const fetched = await getResult(created.data.resultId);

  expect(fetched).toEqual({ ok: true, data: created.data });
});

test('목 모드에서 모르는 resultId 는 RESULT_NOT_FOUND', async () => {
  vi.stubEnv('VITE_API_MOCK', 'true');

  const result = await getResult('unknown-id');

  expect(result).toEqual({
    ok: false,
    error: { kind: 'api', code: 'RESULT_NOT_FOUND', message: expect.any(String) },
  });
});
