import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { KakaoLoginButton } from './KakaoLoginButton';

beforeEach(() => {
  vi.stubEnv('VITE_KAKAO_CLIENT_ID', 'test-client-id');
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  sessionStorage.clear();
});

test('누르면 이 origin 의 redirectPath 로 만든 카카오 인가 URL 로 이동한다', () => {
  const navigate = vi.fn();
  render(<KakaoLoginButton navigate={navigate} redirectPath="/dev/kakao-callback" />);

  fireEvent.click(screen.getByRole('button', { name: '카카오로 로그인' }));

  expect(navigate).toHaveBeenCalledTimes(1);
  const url = new URL(navigate.mock.calls[0]?.[0] as string);
  expect(url.origin + url.pathname).toBe('https://kauth.kakao.com/oauth/authorize');
  expect(url.searchParams.get('redirect_uri')).toBe(`${window.location.origin}/dev/kakao-callback`);
});

test('설정이 빠져 있으면 콘솔에만 남기고 버튼을 다시 누를 수 있다', () => {
  vi.stubEnv('VITE_KAKAO_CLIENT_ID', '');
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  const navigate = vi.fn();

  render(<KakaoLoginButton navigate={navigate} redirectPath="/dev/kakao-callback" />);
  const button = screen.getByRole('button', { name: '카카오로 로그인' });
  fireEvent.click(button);

  expect(navigate).not.toHaveBeenCalled();
  expect(consoleError).toHaveBeenCalled();
  expect(button).not.toBeDisabled();
});
