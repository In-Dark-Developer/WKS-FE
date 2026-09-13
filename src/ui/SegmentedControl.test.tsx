import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { SegmentedControl } from './SegmentedControl';

afterEach(() => {
  cleanup();
});

const options = [
  { value: 'SOLAR', label: '양력' },
  { value: 'LUNAR', label: '음력' },
] as const;

test('두 옵션을 라디오로 렌더하고 선택값을 표시한다', () => {
  render(
    <SegmentedControl label="달력 기준" onChange={() => {}} options={options} value="SOLAR" />,
  );

  const group = screen.getByRole('radiogroup', { name: '달력 기준' });

  expect(group).toBeInTheDocument();
  expect(screen.getByRole('radio', { name: '양력' })).toBeChecked();
  expect(screen.getByRole('radio', { name: '음력' })).not.toBeChecked();
});

test('다른 옵션을 고르면 그 값으로 onChange 를 부른다', () => {
  const onChange = vi.fn();
  render(
    <SegmentedControl label="달력 기준" onChange={onChange} options={options} value="SOLAR" />,
  );

  fireEvent.click(screen.getByRole('radio', { name: '음력' }));

  expect(onChange).toHaveBeenCalledWith('LUNAR');
});

test('아무것도 고르지 않은 상태를 표현할 수 있다', () => {
  render(<SegmentedControl label="성별" onChange={() => {}} options={options} value={null} />);

  expect(screen.getAllByRole('radio').every((radio) => !(radio as HTMLInputElement).checked)).toBe(
    true,
  );
});

test('비활성이면 두 옵션 모두 비활성이다', () => {
  const onChange = vi.fn();
  render(
    <SegmentedControl
      disabled
      label="달력 기준"
      onChange={onChange}
      options={options}
      value="SOLAR"
    />,
  );

  expect(screen.getByRole('radio', { name: '양력' })).toBeDisabled();
  expect(screen.getByRole('radio', { name: '음력' })).toBeDisabled();
});
