import { afterEach, expect, test, vi } from 'vitest';

const { createSignupMock } = vi.hoisted(() => ({ createSignupMock: vi.fn() }));
vi.mock('@/api/signups', () => ({ createSignup: createSignupMock }));

import { readSession, writeSession } from '@/api/session';

import type { ActionFunctionArgs } from 'react-router-dom';

import { preRegisterAction } from './preRegisterAction';

const input = {
  name: '김운꿰',
  email: 'wks@dongguk.edu',
  contactMethod: 'PHONE',
  contactValue: '01012345678',
  department: null,
  mbti: null,
  bio: null,
  gender: 'MALE',
  preferGender: 'FEMALE',
};

const URL_ = 'http://test/reading/r1/pre-register';

function args(body: unknown): ActionFunctionArgs {
  return {
    request: new Request(URL_, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    }),
    params: {},
    context: {},
    url: new URL(URL_),
    pattern: '/reading/:id/pre-register',
  };
}

afterEach(() => {
  createSignupMock.mockReset();
  localStorage.clear();
  vi.restoreAllMocks();
});

test('보관된 내 결과를 함께 보내고 완료를 돌려준다', async () => {
  writeSession('3f2a9c1e-1111-4111-8111-111111111111');
  createSignupMock.mockResolvedValue({
    ok: true,
    data: { signupId: 1, couponIssued: true, mailSent: true, message: '접수' },
  });

  const data = await preRegisterAction(args(input));

  expect(createSignupMock).toHaveBeenCalledWith({
    ...input,
    resultId: '3f2a9c1e-1111-4111-8111-111111111111',
  });
  expect(data).toEqual({ status: 'done', mailSent: true });
});

test('사진은 계약에 없어 요청 본문에 실리지 않는다', async () => {
  createSignupMock.mockResolvedValue({
    ok: true,
    data: { signupId: 1, couponIssued: true, mailSent: true, message: '접수' },
  });

  await preRegisterAction(args({ ...input, photo: 'data:image/png;base64,AAAA' }));

  expect(createSignupMock).toHaveBeenCalledWith({ ...input, resultId: null });
});

test('백엔드가 모르는 결과면 보관된 결과를 비우고 사주 없이 한 번 더 보낸다', async () => {
  writeSession('3f2a9c1e-1111-4111-8111-111111111111');
  createSignupMock
    .mockResolvedValueOnce({
      ok: false,
      error: { kind: 'api', code: 'RESULT_NOT_FOUND', message: '없음' },
    })
    .mockResolvedValueOnce({
      ok: true,
      data: { signupId: 2, couponIssued: true, mailSent: false, message: '접수' },
    });

  const data = await preRegisterAction(args(input));

  expect(createSignupMock).toHaveBeenLastCalledWith({ ...input, resultId: null });
  expect(data).toEqual({ status: 'done', mailSent: false });
  expect(readSession()).toBeNull();
});

test('이미 신청한 이메일·학교 메일 아님·연결 실패를 구분해 돌려준다', async () => {
  for (const [code, formError] of [
    ['DUPLICATE_SIGNUP', 'duplicate'],
    ['INVALID_EMAIL_DOMAIN', 'domain'],
    ['INTERNAL_ERROR', 'connection'],
  ] as const) {
    createSignupMock.mockResolvedValue({ ok: false, error: { kind: 'api', code, message: '' } });
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(await preRegisterAction(args(input))).toEqual({ formError });
  }
});
