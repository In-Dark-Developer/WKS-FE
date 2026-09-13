import { z } from 'zod';
import { afterEach, expect, test, vi } from 'vitest';

import { request } from './client';
import { clearSession, readSession, writeSession } from './session';

const dataSchema = z.object({ id: z.string() });

function jsonResponse(body: unknown): Response {
  return { json: () => Promise.resolve(body) } as Response;
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  localStorage.clear();
});

test('성공 응답을 데이터로 돌려준다', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(jsonResponse({ success: true, data: { id: 'r1' } })),
  );

  const result = await request({ method: 'GET', path: '/x' }, dataSchema);

  expect(result).toEqual({ ok: true, data: { id: 'r1' } });
});

test('세션이 있으면 Authorization 헤더로 싣는다', async () => {
  writeSession('token-1');
  const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ success: true, data: { id: 'r1' } }));
  vi.stubGlobal('fetch', fetchMock);

  await request({ method: 'GET', path: '/x' }, dataSchema);

  const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
  expect((init.headers as Record<string, string>).Authorization).toBe('Bearer token-1');
});

test('세션이 없으면 Authorization 헤더를 싣지 않는다', async () => {
  const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ success: true, data: { id: 'r1' } }));
  vi.stubGlobal('fetch', fetchMock);

  await request({ method: 'GET', path: '/x' }, dataSchema);

  const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
  expect(init.headers as Record<string, string>).not.toHaveProperty('Authorization');
});

test('fetch 가 실패하면 네트워크 실패로 본다', async () => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

  const result = await request({ method: 'POST', path: '/x' }, dataSchema);

  expect(result).toEqual({ ok: false, error: { kind: 'network' } });
});

test('응답이 JSON 이 아니면 네트워크 실패로 본다', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ json: () => Promise.reject(new Error('not json')) } as Response),
  );

  const result = await request({ method: 'POST', path: '/x' }, dataSchema);

  expect(result).toEqual({ ok: false, error: { kind: 'network' } });
});

test('봉투가 계약과 다르면 스키마 위반으로 본다', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ success: true, data: {} })));

  const result = await request({ method: 'GET', path: '/x' }, dataSchema);

  expect(result).toEqual({ ok: false, error: { kind: 'schema' } });
});

test('백엔드 에러 코드·메시지를 그대로 돌려준다', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      jsonResponse({
        success: false,
        error: { code: 'RESULT_NOT_FOUND', message: '점지된 결과를 찾을 수 없어요.' },
      }),
    ),
  );

  const result = await request({ method: 'GET', path: '/x' }, dataSchema);

  expect(result).toEqual({
    ok: false,
    error: { kind: 'api', code: 'RESULT_NOT_FOUND', message: '점지된 결과를 찾을 수 없어요.' },
  });
});

test('GET 은 네트워크 실패 시 한 번 재시도해 성공하면 그 결과를 쓴다', async () => {
  const fetchMock = vi
    .fn()
    .mockRejectedValueOnce(new TypeError('Failed to fetch'))
    .mockResolvedValueOnce(jsonResponse({ success: true, data: { id: 'r1' } }));
  vi.stubGlobal('fetch', fetchMock);

  const result = await request({ method: 'GET', path: '/x' }, dataSchema);

  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(result).toEqual({ ok: true, data: { id: 'r1' } });
});

test('POST 는 네트워크 실패를 재시도하지 않는다', async () => {
  const fetchMock = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
  vi.stubGlobal('fetch', fetchMock);

  const result = await request({ method: 'POST', path: '/x' }, dataSchema);

  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(result).toEqual({ ok: false, error: { kind: 'network' } });
});

test('INVALID_TOKEN 응답을 받으면 세션을 지운다', async () => {
  writeSession('token-1');
  vi.stubGlobal(
    'fetch',
    vi
      .fn()
      .mockResolvedValue(
        jsonResponse({ success: false, error: { code: 'INVALID_TOKEN', message: '세션 만료' } }),
      ),
  );

  await request({ method: 'GET', path: '/x' }, dataSchema);

  expect(readSession()).toBeNull();
});

test('다른 에러 코드로는 세션을 지우지 않는다', async () => {
  writeSession('token-1');
  vi.stubGlobal(
    'fetch',
    vi
      .fn()
      .mockResolvedValue(
        jsonResponse({ success: false, error: { code: 'INTERNAL_ERROR', message: '오류' } }),
      ),
  );

  await request({ method: 'GET', path: '/x' }, dataSchema);

  expect(readSession()).toEqual({ token: 'token-1' });
  clearSession();
});
