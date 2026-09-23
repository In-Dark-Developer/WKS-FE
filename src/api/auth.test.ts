import { afterEach, expect, test, vi } from 'vitest';

import { fetchMe, loginWithKakao } from './auth';
import { writeAuthToken } from './authToken';

function jsonResponse(body: unknown): Response {
  return { json: () => Promise.resolve(body) } as Response;
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  localStorage.clear();
});

test('로그인 성공 응답을 그대로 돌려준다', async () => {
  const fetchMock = vi.fn().mockResolvedValue(
    jsonResponse({
      success: true,
      data: {
        token: 'jwt-token-1',
        isNewUser: true,
        restoredResultId: null,
        rewardGranted: null,
      },
    }),
  );
  vi.stubGlobal('fetch', fetchMock);

  const result = await loginWithKakao({
    code: 'auth-code',
    redirectUri: 'http://localhost:5173/x',
  });

  expect(result).toEqual({
    ok: true,
    data: { token: 'jwt-token-1', isNewUser: true, restoredResultId: null, rewardGranted: null },
  });
  const [url] = fetchMock.mock.calls[0] as [string];
  expect(url).toContain('/auth/kakao');
});

test('로그인 요청은 Authorization 헤더를 싣지 않는다 — /auth/kakao 자체는 인증이 필요 없다', async () => {
  writeAuthToken('stale-token'); // 이전 로그인이 남아 있어도 새 로그인 요청엔 영향 없어야 한다
  const fetchMock = vi.fn().mockResolvedValue(
    jsonResponse({
      success: true,
      data: { token: 't', isNewUser: false, restoredResultId: null, rewardGranted: null },
    }),
  );
  vi.stubGlobal('fetch', fetchMock);

  await loginWithKakao({ code: 'auth-code', redirectUri: 'http://localhost:5173/x' });

  const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
  expect(init.headers as Record<string, string>).not.toHaveProperty('Authorization');
});

test('fetchMe 는 저장된 토큰을 Authorization 헤더로 싣는다', async () => {
  writeAuthToken('jwt-token-1');
  const fetchMock = vi.fn().mockResolvedValue(
    jsonResponse({
      success: true,
      data: { memberId: 12, hasResult: true, hasDatingProfile: false, threadBalance: 0 },
    }),
  );
  vi.stubGlobal('fetch', fetchMock);

  const result = await fetchMe();

  expect(result).toEqual({
    ok: true,
    data: { memberId: 12, hasResult: true, hasDatingProfile: false, threadBalance: 0 },
  });
  const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
  expect((init.headers as Record<string, string>)['Authorization']).toBe('Bearer jwt-token-1');
});

test('fetchMe 는 로그인 실패(UNAUTHENTICATED)를 api 에러로 돌려준다', async () => {
  const fetchMock = vi.fn().mockResolvedValue(
    jsonResponse({
      success: false,
      error: { code: 'UNAUTHENTICATED', message: '로그인이 필요합니다.' },
    }),
  );
  vi.stubGlobal('fetch', fetchMock);

  const result = await fetchMe();

  expect(result).toEqual({
    ok: false,
    error: { kind: 'api', code: 'UNAUTHENTICATED', message: '로그인이 필요합니다.' },
  });
});
