import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { FortuneLoading } from './FortuneLoading';

afterEach(cleanup);

test('대기와 지연은 진행 중 상태로 알린다', () => {
  const { rerender } = render(<FortuneLoading state="loading" />);
  expect(screen.getByRole('status')).toHaveTextContent('보살님이 점지해주는 중입니다');

  rerender(<FortuneLoading state="delayed" />);
  expect(screen.getByRole('status')).toHaveTextContent('조금 더 시간이 걸리고 있어요');
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

test('대기는 점지 영상을 화면에 채워 소리 없이 반복하고, 영상을 못 틀면 문구를 보인다', () => {
  const { container } = render(<FortuneLoading state="loading" />);
  const video = container.querySelector('video');

  expect(video).toHaveAttribute('loop');
  expect(video).toHaveAttribute('playsinline');
  expect(video?.muted).toBe(true);
  expect(video).toHaveAttribute('aria-hidden', 'true');
  expect(screen.getByRole('status')).toHaveTextContent('보살님이 점지해주는 중입니다');

  fireEvent.error(video as HTMLVideoElement);

  expect(container.querySelector('video')).not.toBeInTheDocument();
  expect(screen.getByText('보살님이 점지해주는 중입니다')).toBeVisible();
});

test('실패하면 경고로 알리고 다시 시도를 누를 수 있다', () => {
  const onRetry = vi.fn();
  render(<FortuneLoading onRetry={onRetry} state="error" />);

  expect(screen.getByRole('alert')).toHaveTextContent('결과를 가져오지 못했어요');
  fireEvent.click(screen.getByRole('button', { name: '다시 시도' }));
  expect(onRetry).toHaveBeenCalledOnce();
});
