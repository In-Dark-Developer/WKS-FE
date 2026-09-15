import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { IntroVideo } from './IntroVideo';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

test('건너뛰기 버튼은 2초가 지나야 나타난다', () => {
  render(<IntroVideo onFinish={() => {}} />);

  act(() => vi.advanceTimersByTime(1999));
  expect(screen.queryByRole('button', { name: '건너뛰기' })).not.toBeInTheDocument();

  act(() => vi.advanceTimersByTime(1));
  expect(screen.getByRole('button', { name: '건너뛰기' })).toBeInTheDocument();
});

test('건너뛰기를 누르면 끝낸다', () => {
  const onFinish = vi.fn();
  render(<IntroVideo onFinish={onFinish} />);

  act(() => vi.advanceTimersByTime(2000));
  fireEvent.click(screen.getByRole('button', { name: '건너뛰기' }));

  expect(onFinish).toHaveBeenCalledOnce();
});

test('영상이 끝나면 끝낸다', () => {
  const onFinish = vi.fn();
  render(<IntroVideo onFinish={onFinish} />);

  fireEvent.ended(screen.getByLabelText('인트로 영상'));

  expect(onFinish).toHaveBeenCalledOnce();
});

test('영상을 불러오지 못하면 끝낸다', () => {
  const onFinish = vi.fn();
  render(<IntroVideo onFinish={onFinish} />);

  fireEvent.error(screen.getByLabelText('인트로 영상'));

  expect(onFinish).toHaveBeenCalledOnce();
});
