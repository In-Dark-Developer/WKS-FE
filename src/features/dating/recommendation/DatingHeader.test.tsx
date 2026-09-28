import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { DatingHeader } from './DatingHeader';

afterEach(cleanup);

// QA(2026-09-28): 상단 바의 그림·글자 간격이 Figma `91:1790` 과 달랐다 — 두 칸은 56px 안에서
// 그림이 위, 글자가 아래에 붙는다(그림 높이가 달라 간격이 6px·0px 로 생긴다).
test('두 칸은 56px 높이 안에서 그림과 글자를 위아래로 붙인다 (Figma 91:1790)', () => {
  render(<DatingHeader onOpenRequests={vi.fn()} onOpenThreadGuide={vi.fn()} />);

  for (const name of ['운명의 실 획득 방법 보기', '요청함']) {
    const button = screen.getByRole('button', { name });
    expect(button).toHaveClass('h-[56px]', 'flex-col', 'justify-between');
  }
});

test('운명의 실은 안내 모달을, 요청함은 요청함을 연다', () => {
  const onOpenThreadGuide = vi.fn();
  const onOpenRequests = vi.fn();
  render(<DatingHeader onOpenRequests={onOpenRequests} onOpenThreadGuide={onOpenThreadGuide} />);

  fireEvent.click(screen.getByRole('button', { name: '운명의 실 획득 방법 보기' }));
  fireEvent.click(screen.getByRole('button', { name: '요청함' }));

  expect(onOpenThreadGuide).toHaveBeenCalledOnce();
  expect(onOpenRequests).toHaveBeenCalledOnce();
});

test('보유 개수는 상단에 두지 않는다 (2026-09-27 결정)', () => {
  render(<DatingHeader onOpenRequests={vi.fn()} onOpenThreadGuide={vi.fn()} />);

  expect(screen.queryByText(/개$/)).not.toBeInTheDocument();
});
