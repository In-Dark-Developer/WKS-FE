import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { SendThreadDialog, ThreadSentDialog } from './ThreadDialogs';

afterEach(cleanup);

test('보내기 전에 열지 않은 정보를 더 볼 수 없음을 알리고, 보내기를 넘긴다', () => {
  const onSend = vi.fn();
  render(<SendThreadDialog onClose={vi.fn()} onSend={onSend} open />);

  expect(screen.getByRole('dialog', { name: '운명의 실을 보내시겠어요?' })).toBeVisible();
  expect(screen.getByText(/더 이상 확인할 수 없어요/)).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: '보내기' }));

  expect(onSend).toHaveBeenCalledOnce();
});

test('보낸 뒤 보러가기는 요청함을 연다', () => {
  const onOpenRequests = vi.fn();
  render(<ThreadSentDialog onClose={vi.fn()} onOpenRequests={onOpenRequests} open />);

  fireEvent.click(screen.getByRole('button', { name: '보러가기' }));

  expect(onOpenRequests).toHaveBeenCalledOnce();
});
