import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { Tabs } from './Tabs';

afterEach(cleanup);

const tabs = [
  { value: 'sent', label: '보낸 신청' },
  { value: 'received', label: '받은 신청' },
] as const;

test('고른 탭만 선택으로 알리고, 누른 탭의 값을 돌려준다', () => {
  const onChange = vi.fn();
  render(<Tabs label="요청함" onChange={onChange} tabs={tabs} value="sent" />);

  expect(screen.getByRole('tablist', { name: '요청함' })).toBeVisible();
  expect(screen.getByRole('tab', { name: '보낸 신청' })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('tab', { name: '받은 신청' })).toHaveAttribute('aria-selected', 'false');

  fireEvent.click(screen.getByRole('tab', { name: '받은 신청' }));

  expect(onChange).toHaveBeenCalledWith('received');
});
