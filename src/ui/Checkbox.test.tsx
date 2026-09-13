import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { Checkbox } from './Checkbox';

afterEach(() => {
  cleanup();
});

test('라벨을 누르면 체크 상태가 바뀐다', () => {
  const onChange = vi.fn();
  render(<Checkbox label="태어난 시간을 몰라요" onChange={onChange} />);

  const checkbox = screen.getByRole('checkbox', { name: '태어난 시간을 몰라요' });
  fireEvent.click(screen.getByText('태어난 시간을 몰라요'));

  expect(checkbox).toBeChecked();
  expect(onChange).toHaveBeenCalledTimes(1);
});

test('에러 상태를 invalid 로 알린다', () => {
  render(<Checkbox invalid label="개인정보 수집에 동의해요" />);

  expect(screen.getByRole('checkbox', { name: '개인정보 수집에 동의해요' })).toHaveAttribute(
    'aria-invalid',
    'true',
  );
});

test('비활성 체크박스는 비활성 상태다', () => {
  render(<Checkbox disabled label="태어난 시간을 몰라요" />);

  expect(screen.getByRole('checkbox', { name: '태어난 시간을 몰라요' })).toBeDisabled();
});
