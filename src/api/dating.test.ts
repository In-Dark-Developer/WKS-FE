import { afterEach, expect, test, vi } from 'vitest';

import { saveDatingProfile, type DatingProfileRequest } from './dating';
import { getMe, signInMockAccount, signOutMockAccount } from './me';

const request: DatingProfileRequest = {
  resultId: '3f2a9c1e-1111-4111-8111-111111111111',
  name: '김채원',
  photoKey: 'mock-photos/1',
  email: 'chaewon@dgu.ac.kr',
  contactMethod: 'PHONE',
  contactValue: '01012345678',
  department: '컴퓨터공학과',
  mbti: 'ENTP',
  bio: '영화와 전시를 좋아해요.',
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.useRealTimers();
  signOutMockAccount();
});

test('명세 전이라 실제 모드는 요청 없이 준비 중 실패를 돌려준다', async () => {
  vi.stubEnv('VITE_API_MOCK', 'false');
  const fetchSpy = vi.spyOn(globalThis, 'fetch');

  const outcome = await saveDatingProfile(request);

  expect(outcome).toMatchObject({ ok: false, error: { kind: 'api', code: 'NOT_FOUND' } });
  expect(fetchSpy).not.toHaveBeenCalled();
  fetchSpy.mockRestore();
});

test('목 모드에서 저장하면 내 정보가 프로필 등록 완료로 바뀐다', async () => {
  vi.stubEnv('VITE_API_MOCK', 'true');
  vi.useFakeTimers();
  signInMockAccount();

  const pending = saveDatingProfile(request);
  await vi.runAllTimersAsync();

  await expect(pending).resolves.toEqual({ ok: true, data: null });
  await expect(getMe()).resolves.toMatchObject({ ok: true, data: { hasDatingProfile: true } });
});
