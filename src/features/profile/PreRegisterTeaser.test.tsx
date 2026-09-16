import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { PreRegisterTeaser } from './PreRegisterTeaser';

afterEach(cleanup);

test('오픈일과 안내를 보이고 누르면 사전신청으로 간다', () => {
  const onApply = vi.fn();
  render(<PreRegisterTeaser onApply={onApply} />);

  expect(screen.getByRole('heading', { name: 'GRAND OPEN !!' })).toBeInTheDocument();
  expect(screen.getByText('09월 29일')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '사전 신청하고 알림 받기' }));

  expect(onApply).toHaveBeenCalledOnce();
});
