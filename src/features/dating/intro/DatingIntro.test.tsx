import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { DatingIntro } from './DatingIntro';

afterEach(() => {
  cleanup();
  document.body.style.overflow = '';
});

function renderIntro(viewer: 'guest' | 'member') {
  const handlers = { onStart: vi.fn(), onKakaoLogin: vi.fn(), onLogout: vi.fn() };
  render(<DatingIntro view={{ viewer }} {...handlers} />);
  return handlers;
}

test('비로그인이면 로그인 안내 버튼이 카카오 로그인 시트를 연다', () => {
  const { onKakaoLogin, onStart } = renderIntro('guest');

  expect(screen.queryByRole('button', { name: '로그아웃' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '로그인하고 내 운명 찾아 떠나기' }));
  fireEvent.click(screen.getByRole('button', { name: '카카오로 시작하기' }));

  expect(onKakaoLogin).toHaveBeenCalledTimes(1);
  expect(onStart).not.toHaveBeenCalled();
});

test("로그인 시트의 '나중에 할래요'는 시트만 닫는다", () => {
  const { onKakaoLogin } = renderIntro('guest');

  fireEvent.click(screen.getByRole('button', { name: '로그인하고 내 운명 찾아 떠나기' }));
  fireEvent.click(screen.getByRole('button', { name: '나중에 할래요' }));

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(onKakaoLogin).not.toHaveBeenCalled();
});

test('로그인했으면 시작 버튼과 로그아웃이 보인다', () => {
  const { onStart, onLogout } = renderIntro('member');

  fireEvent.click(screen.getByRole('button', { name: '내 운명 찾아 떠나기' }));
  fireEvent.click(screen.getByRole('button', { name: '로그아웃' }));

  expect(onStart).toHaveBeenCalledTimes(1);
  expect(onLogout).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
