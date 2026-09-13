import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { PreRegisterTeaser } from './PreRegisterTeaser';

afterEach(cleanup);

test('신청 가능하면 신청하기를 눌러 모달을 연다', () => {
  const onApply = vi.fn();
  render(<PreRegisterTeaser onApply={onApply} state="available" />);

  expect(
    screen.getByRole('heading', { name: '당신의 축제 인연을 만나보세요' }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '신청하기' }));
  expect(onApply).toHaveBeenCalledOnce();
});

test('마감이면 버튼이 잠긴다', () => {
  render(<PreRegisterTeaser state="closed" />);

  expect(screen.getByRole('button', { name: '신청 마감' })).toBeDisabled();
});
