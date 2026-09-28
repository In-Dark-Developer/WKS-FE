import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { LockedValue } from './LockedValue';

afterEach(cleanup);

test('흐린 자리는 읽히지 않고 알약만 읽힌다', () => {
  render(<LockedValue label="학과 5개로 열기">가짜 학과</LockedValue>);

  expect(screen.getByText('가짜 학과').closest('[aria-hidden="true"]')).not.toBeNull();
  expect(screen.getByText('학과 5개로 열기')).toBeVisible();
  expect(screen.queryByRole('button')).toBeNull();
});

test('onUnlock 을 주면 알약이 버튼이 된다', () => {
  const onUnlock = vi.fn();
  render(<LockedValue label="사진 10개로 열기" onUnlock={onUnlock} />);

  fireEvent.click(screen.getByRole('button', { name: '사진 10개로 열기' }));

  expect(onUnlock).toHaveBeenCalledOnce();
});
