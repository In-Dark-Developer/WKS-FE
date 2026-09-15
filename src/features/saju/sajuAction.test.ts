import type { ActionFunctionArgs } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';

import { writePendingShare } from '@/api/pendingShare';

const { createResultMock } = vi.hoisted(() => ({ createResultMock: vi.fn() }));
vi.mock('@/api/results', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/results')>();
  return { ...actual, createResult: createResultMock };
});

import { sajuAction } from './sajuAction';

const validInput = {
  gender: 'MALE',
  calendarType: 'SOLAR',
  isLeapMonth: false,
  birthDate: '2002-01-01',
  birthTime: '06:30',
  nickname: '보살',
};

function actionArgs(body: unknown): ActionFunctionArgs {
  return {
    request: new Request('http://test/', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    }),
    params: {},
    context: {},
    url: new URL('http://test/'),
    pattern: '/',
  };
}

afterEach(() => {
  createResultMock.mockReset();
  sessionStorage.clear();
  vi.restoreAllMocks();
});

test('성공하면 결과 화면으로 redirect 한다', async () => {
  createResultMock.mockResolvedValue({ ok: true, data: { resultId: 'r1' } });

  const response = await sajuAction(actionArgs(validInput));

  expect(response).toBeInstanceOf(Response);
  if (!(response instanceof Response)) throw new Error('unreachable');
  expect(response.status).toBe(302);
  expect(response.headers.get('Location')).toBe('/reading/r1');
});

test('공유 링크로 들어와 보관된 shareId 가 있으면 궁합을 만들러 간다', async () => {
  const shareId = '5a951b51-21d5-4601-91b9-560de47aaaca';
  writePendingShare(shareId);
  createResultMock.mockResolvedValue({ ok: true, data: { resultId: 'r1' } });

  const response = await sajuAction(actionArgs(validInput));

  if (!(response instanceof Response)) throw new Error('redirect 가 아니다');
  expect(response.headers.get('Location')).toBe(`/s/${shareId}/join`);
});

test('요청 본문을 계약 모양(ResultRequestInput)으로 그대로 넘긴다', async () => {
  createResultMock.mockResolvedValue({ ok: true, data: { resultId: 'r1' } });

  await sajuAction(actionArgs(validInput));

  expect(createResultMock).toHaveBeenCalledWith(validInput);
});

test('실패하면 원인을 콘솔에 남기고 formError: connection 을 돌려준다', async () => {
  const log = vi.spyOn(console, 'error').mockImplementation(() => {});
  createResultMock.mockResolvedValue({ ok: false, error: { kind: 'network' } });

  const result = await sajuAction(actionArgs(validInput));

  expect(result).toEqual({ formError: 'connection' });
  expect(log).toHaveBeenCalled();
});

test('요청 본문 모양이 이상하면 던진다', async () => {
  await expect(sajuAction(actionArgs({ ...validInput, gender: 'ALIEN' }))).rejects.toThrow();
  expect(createResultMock).not.toHaveBeenCalled();
});
