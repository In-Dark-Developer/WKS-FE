import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { Toast } from './Toast';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

test('open 이 false 면 아무것도 그리지 않는다', () => {
  render(<Toast message="복사되었습니다" onClose={vi.fn()} open={false} />);

  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});

test('open 이면 메시지를 보여준다', () => {
  render(<Toast message="복사되었습니다" onClose={vi.fn()} open />);

  expect(screen.getByRole('status')).toHaveTextContent('복사되었습니다');
});

test('duration 이 지나면 onClose 를 부른다', () => {
  const onClose = vi.fn();
  render(<Toast duration={2000} message="복사되었습니다" onClose={onClose} open />);

  expect(onClose).not.toHaveBeenCalled();
  vi.advanceTimersByTime(2000);

  expect(onClose).toHaveBeenCalledTimes(1);
});

test('닫히면 다시 열릴 때까지 타이머를 잡지 않는다', () => {
  const onClose = vi.fn();
  const { rerender } = render(
    <Toast duration={1000} message="복사되었습니다" onClose={onClose} open={false} />,
  );

  vi.advanceTimersByTime(5000);
  expect(onClose).not.toHaveBeenCalled();

  rerender(<Toast duration={1000} message="복사되었습니다" onClose={onClose} open />);
  vi.advanceTimersByTime(1000);
  expect(onClose).toHaveBeenCalledTimes(1);
});
