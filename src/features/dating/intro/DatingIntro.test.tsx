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

test('배경 카드 벽은 세 줄이 왼쪽·오른쪽·왼쪽으로 흐르고, 줄마다 카드 한 벌을 두 번 이어 붙인다', () => {
  const { container } = render(
    <DatingIntro
      onKakaoLogin={() => {}}
      onLogout={() => {}}
      onStart={() => {}}
      view={{ viewer: 'guest' }}
    />,
  );

  const rows = [...container.ownerDocument.querySelectorAll('[data-card-wall-row]')];
  expect(rows.map((row) => row.getAttribute('data-card-wall-row'))).toEqual([
    'left',
    'right',
    'left',
  ]);
  // 두 벌이어야 한 벌만큼 옮긴 뒤 처음으로 돌아가도 이음매가 보이지 않는다.
  for (const row of rows) expect(row.children).toHaveLength(8);
});
