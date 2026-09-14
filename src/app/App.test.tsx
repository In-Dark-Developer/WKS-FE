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

test('개발 서버에서는 /preview 가 퍼블리싱 확인 목록을 보여 준다', { timeout: 15000 }, async () => {
  // 라우터는 App 모듈을 불러올 때 현재 주소로 만들어진다 — 주소를 바꾼 뒤 새로 불러온다.
  window.history.pushState({}, '', '/preview');
  vi.resetModules();
  const { App: FreshApp } = await import('@/app/App');

  render(<FreshApp />);

  // lazy 라우트가 미리보기 화면 전부를 eager glob 으로 불러온다 — jsdom 에서 findByRole 기본 1초와
  // 테스트 기본 5초를 넘길 수 있어 둘 다 늘린다.
  expect(
    await screen.findByRole('heading', { name: '퍼블리싱 확인' }, { timeout: 10000 }),
  ).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /SCR-02 사주 입력/ })).toHaveAttribute(
    'href',
    '/preview/saju',
  );
});
