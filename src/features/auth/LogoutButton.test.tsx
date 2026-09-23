import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { readAuthToken, writeAuthToken } from '@/api/authToken';

import { LogoutButton } from './LogoutButton';

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});

test('누르면 저장된 토큰을 지운다', () => {
  writeAuthToken('token-1');
  render(<LogoutButton />);

  fireEvent.click(screen.getByRole('button', { name: '로그아웃' }));

  expect(readAuthToken()).toBeNull();
});

test('지운 뒤 onLoggedOut 을 호출한다', () => {
  writeAuthToken('token-1');
  const onLoggedOut = vi.fn();
  render(<LogoutButton onLoggedOut={onLoggedOut} />);

  fireEvent.click(screen.getByRole('button', { name: '로그아웃' }));

  expect(onLoggedOut).toHaveBeenCalledTimes(1);
});
