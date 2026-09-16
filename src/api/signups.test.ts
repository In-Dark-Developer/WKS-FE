import { afterEach, expect, test, vi } from 'vitest';

const { requestMock } = vi.hoisted(() => ({ requestMock: vi.fn() }));
vi.mock('./client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./client')>();
  return { ...actual, request: requestMock };
});

import { createSignup, resendSignupMail } from './signups';
import type { SignupRequestInput } from './schema/signups';

const input: SignupRequestInput = {
  email: 'wks@dongguk.edu',
  resultId: null,
  gender: 'MALE',
  preferGender: 'FEMALE',
  name: '김운꿰',
  contactMethod: 'PHONE',
  contactValue: '01012345678',
  department: null,
  mbti: null,
  bio: null,
};

afterEach(() => requestMock.mockReset());

test('POST /signups 로 계약이 받는 값만 보낸다', async () => {
  requestMock.mockResolvedValue({ ok: true, data: {} });

  await createSignup(input);

  expect(requestMock).toHaveBeenCalledWith(
    { method: 'POST', path: '/signups', body: input },
    expect.anything(),
  );
});

test('MBTI 가 16유형이 아니면 보내기 전에 막는다', async () => {
  await expect(createSignup({ ...input, mbti: 'XXXX' })).rejects.toThrow();
  expect(requestMock).not.toHaveBeenCalled();
});

test('재발송은 이메일만 보낸다', async () => {
  requestMock.mockResolvedValue({ ok: true, data: { mailSent: true, message: '' } });

  await resendSignupMail('wks@dongguk.edu');

  expect(requestMock).toHaveBeenCalledWith(
    { method: 'POST', path: '/signups/resend', body: { email: 'wks@dongguk.edu' } },
    expect.anything(),
  );
});
