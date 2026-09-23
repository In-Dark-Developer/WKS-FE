import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { writeAuthToken } from '@/api/authToken';

import { KakaoLoginTestPage } from './KakaoLoginTestPage';

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  localStorage.clear();
});

test('로그인 전에는 로그인 버튼을 보여준다', () => {
  vi.stubEnv('VITE_KAKAO_CLIENT_ID', 'test-client-id');

  render(<KakaoLoginTestPage />);

  expect(screen.getByRole('button', { name: '카카오로 로그인' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: '로그아웃' })).not.toBeInTheDocument();
});

test('로그인 상태면 로그아웃 버튼을 보여주고, 누르면 로그인 버튼으로 되돌아온다', () => {
  writeAuthToken('token-1');

  render(<KakaoLoginTestPage />);
  expect(screen.getByRole('button', { name: '로그아웃' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: '로그아웃' }));

  expect(screen.getByRole('button', { name: '카카오로 로그인' })).toBeInTheDocument();
});
