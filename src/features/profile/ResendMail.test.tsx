import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

const { resendSignupMailMock } = vi.hoisted(() => ({ resendSignupMailMock: vi.fn() }));
vi.mock('@/api/signups', () => ({ resendSignupMail: resendSignupMailMock }));

import { ResendMail } from './ResendMail';

afterEach(() => {
  cleanup();
  resendSignupMailMock.mockReset();
});

function clickResend() {
  render(<ResendMail email="wks@dongguk.edu" />);
  fireEvent.click(screen.getByRole('button', { name: '인증 메일 다시 받기' }));
}

test('재발송에 성공하면 안내를 보이고 버튼을 거둔다', async () => {
  resendSignupMailMock.mockResolvedValue({ ok: true, data: { mailSent: true, message: '' } });

  clickResend();

  expect(await screen.findByRole('status')).toHaveTextContent('인증 메일을 다시 보냈어요.');
  expect(resendSignupMailMock).toHaveBeenCalledWith('wks@dongguk.edu');
  expect(screen.queryByRole('button', { name: '인증 메일 다시 받기' })).not.toBeInTheDocument();
});

test('백엔드가 또 발송에 실패하면 다시 시도하게 버튼을 남긴다', async () => {
  resendSignupMailMock.mockResolvedValue({ ok: true, data: { mailSent: false, message: '' } });

  clickResend();

  expect(await screen.findByRole('status')).toHaveTextContent('지금은 메일을 보내지 못했어요.');
  expect(screen.getByRole('button', { name: '인증 메일 다시 받기' })).toBeEnabled();
});

test('이미 인증을 마친 이메일(400 INVALID_INPUT)이면 그렇다고 알린다', async () => {
  resendSignupMailMock.mockResolvedValue({
    ok: false,
    error: { kind: 'api', code: 'INVALID_INPUT', message: '' },
  });

  clickResend();

  expect(await screen.findByRole('status')).toHaveTextContent('이미 인증을 마친 이메일이에요.');
  expect(screen.queryByRole('button', { name: '인증 메일 다시 받기' })).not.toBeInTheDocument();
});
