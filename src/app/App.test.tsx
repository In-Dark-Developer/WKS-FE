import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { App } from '@/app/App';

afterEach(() => {
  cleanup();
  window.history.pushState({}, '', '/');
});

test('루트 경로 콘텐츠를 앱 셸 안에 렌더한다', () => {
  render(<App />);

  const shell = screen.getByRole('main');

  expect(
    within(shell).getByRole('heading', { name: '운명도 꿰어야 사랑이다' }),
  ).toBeInTheDocument();
});

test('개발 서버에서는 /preview 가 퍼블리싱 확인 목록을 보여 준다', async () => {
  // 라우터는 App 모듈을 불러올 때 현재 주소로 만들어진다 — 주소를 바꾼 뒤 새로 불러온다.
  window.history.pushState({}, '', '/preview');
  vi.resetModules();
  const { App: FreshApp } = await import('@/app/App');

  render(<FreshApp />);

  expect(await screen.findByRole('heading', { name: '퍼블리싱 확인' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /SCR-02 사주 입력/ })).toHaveAttribute(
    'href',
    '/preview/saju',
  );
});
