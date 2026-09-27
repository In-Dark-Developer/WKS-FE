import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { ComponentProps } from 'react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { EmailVerification } from './EmailVerification';
import { emailVerificationMessages } from './emailVerificationView';

const NOW = new Date('2026-09-27T12:00:00Z').getTime();

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

type Props = ComponentProps<typeof EmailVerification>;

function renderVerification(props: Partial<Props> = {}) {
  const handlers = { onEmailChange: vi.fn(), onSendCode: vi.fn(), onVerifyCode: vi.fn() };
  render(
    <EmailVerification
      email="chaewon@dgu.ac.kr"
      view={{ status: 'idle' }}
      {...handlers}
      {...props}
    />,
  );
  return handlers;
}

test('보내기 전에는 인증 버튼만 있고 누르면 발송을 요청한다', () => {
  const { onSendCode } = renderVerification();

  expect(screen.queryByLabelText('인증 코드')).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: '인증' }));
  expect(onSendCode).toHaveBeenCalledOnce();
});

test('메일이 비어 있으면 인증 버튼이 막힌다', () => {
  renderVerification({ email: '  ' });

  expect(screen.getByRole('button', { name: '인증' })).toHaveProperty('disabled', true);
});

test('발송 뒤 재발송은 남은 시간을 세다가 0 이 되면 열린다', () => {
  renderVerification({ view: { status: 'sent', resendAvailableAt: NOW + 60_000 } });

  expect(screen.getByRole('button', { name: '재발송 1:00' })).toHaveProperty('disabled', true);
  act(() => vi.advanceTimersByTime(59_000));
  expect(screen.getByRole('button', { name: '재발송 0:01' })).toHaveProperty('disabled', true);
  act(() => vi.advanceTimersByTime(1_000));
  expect(screen.getByRole('button', { name: '재발송' })).toHaveProperty('disabled', false);
});

test('발송 응답이 늦게 와도 재발송 시간은 응답을 받은 때부터 잰다', () => {
  const handlers = { onEmailChange: vi.fn(), onSendCode: vi.fn(), onVerifyCode: vi.fn() };
  const { rerender } = render(
    <EmailVerification email="chaewon@dgu.ac.kr" view={{ status: 'idle' }} {...handlers} />,
  );

  act(() => vi.advanceTimersByTime(10_000));
  rerender(
    <EmailVerification
      email="chaewon@dgu.ac.kr"
      view={{ status: 'sent', resendAvailableAt: Date.now() + 60_000 }}
      {...handlers}
    />,
  );

  expect(screen.getByRole('button', { name: '재발송 1:00' })).toBeTruthy();
});

test('코드는 숫자 6자리가 되어야 확인할 수 있고 그 코드로 확인을 요청한다', () => {
  const { onVerifyCode } = renderVerification({ view: { status: 'sent' } });
  const input = screen.getByLabelText('인증 코드');
  const confirm = screen.getByRole('button', { name: '확인' });

  fireEvent.change(input, { target: { value: '12a34' } });
  expect(input).toHaveProperty('value', '1234');
  expect(confirm).toHaveProperty('disabled', true);

  fireEvent.change(input, { target: { value: '123456' } });
  fireEvent.click(confirm);
  expect(onVerifyCode).toHaveBeenCalledWith('123456');
});

test('코드 오류는 코드 칸 아래에, 발송 오류는 메일 칸 아래에 보인다', () => {
  renderVerification({ view: { status: 'sent', error: 'invalid-code' } });
  expect(screen.getByLabelText('인증 코드').getAttribute('aria-invalid')).toBe('true');
  expect(screen.getByText(emailVerificationMessages['invalid-code'])).toBeTruthy();

  cleanup();
  renderVerification({ view: { status: 'idle', error: 'rate-limited' } });
  expect(screen.getByLabelText('이메일').getAttribute('aria-invalid')).toBe('true');
  expect(screen.getByText(emailVerificationMessages['rate-limited'])).toBeTruthy();
});

test('인증을 마치면 메일은 읽기 전용이 되고 버튼과 코드 칸이 사라진다', () => {
  renderVerification({ view: { status: 'verified' } });

  expect(screen.getByLabelText('이메일')).toHaveProperty('readOnly', true);
  expect(screen.getByText('학교 메일 인증을 마쳤어요')).toBeTruthy();
  expect(screen.queryByRole('button')).toBeNull();
  expect(screen.queryByLabelText('인증 코드')).toBeNull();
});
