import { afterEach, expect, test, vi } from 'vitest';

const { getMeMock } = vi.hoisted(() => ({ getMeMock: vi.fn() }));
vi.mock('@/api/me', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/me')>();
  return { ...actual, getMe: getMeMock };
});

import { datingIntroLoader, findDatingStart, resolveDatingEntry } from './datingEntry';

const unauthenticated = {
  ok: false,
  error: { kind: 'api', code: 'UNAUTHENTICATED', message: '로그인이 필요해요.' },
};

function member(hasResult: boolean, hasDatingProfile: boolean) {
  return { ok: true, data: { memberId: 1, hasResult, hasDatingProfile, threadBalance: 0 } };
}

afterEach(() => {
  getMeMock.mockReset();
  vi.restoreAllMocks();
});

test.each([
  { hasResult: false, hasDatingProfile: false, expected: { kind: 'profile', step: 1 } },
  { hasResult: true, hasDatingProfile: false, expected: { kind: 'profile', step: 2 } },
  { hasResult: true, hasDatingProfile: true, expected: { kind: 'cards' } },
  // 프로필이 있으면 사주 유무와 무관하게 입력을 반복하지 않는다.
  { hasResult: false, hasDatingProfile: true, expected: { kind: 'cards' } },
])('사주 $hasResult · 프로필 $hasDatingProfile → $expected.kind', ({ expected, ...me }) => {
  expect(resolveDatingEntry(me)).toEqual(expected);
});

test('인트로 loader 는 401 이면 비로그인, 그 밖에는 로그인 인트로를 보인다', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});

  getMeMock.mockResolvedValue(unauthenticated);
  await expect(datingIntroLoader()).resolves.toEqual({ viewer: 'guest' });

  getMeMock.mockResolvedValue(member(false, false));
  await expect(datingIntroLoader()).resolves.toEqual({ viewer: 'member' });

  // 조회 실패는 진입을 막지 않는다(FR-24) — 시작 버튼이 다시 묻는다.
  getMeMock.mockResolvedValue({ ok: false, error: { kind: 'network' } });
  await expect(datingIntroLoader()).resolves.toEqual({ viewer: 'member' });
});

test('시작하기는 등록 상태에 맞는 경로로, 실패는 실패로 알린다', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});

  getMeMock.mockResolvedValue(member(true, false));
  await expect(findDatingStart()).resolves.toEqual({ kind: 'go', path: '/dating/profile' });

  getMeMock.mockResolvedValue(member(true, true));
  await expect(findDatingStart()).resolves.toEqual({ kind: 'go', path: '/dating/cards' });

  getMeMock.mockResolvedValue(unauthenticated);
  await expect(findDatingStart()).resolves.toEqual({ kind: 'guest' });

  getMeMock.mockResolvedValue({ ok: false, error: { kind: 'schema' } });
  await expect(findDatingStart()).resolves.toEqual({ kind: 'failed' });
});
