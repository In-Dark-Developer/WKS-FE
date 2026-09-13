import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { TextField } from './TextField';

afterEach(() => {
  cleanup();
});

test('입력하면 onChange 를 부른다', () => {
  const onChange = vi.fn();
  render(<TextField aria-label="닉네임" onChange={onChange} value="" />);

  fireEvent.change(screen.getByRole('textbox', { name: '닉네임' }), { target: { value: '보살' } });

  expect(onChange).toHaveBeenCalledTimes(1);
});

test('값이 있고 onClear 가 있으면 지우기 버튼을 보인다', () => {
  const onClear = vi.fn();
  render(<TextField aria-label="닉네임" onChange={() => {}} onClear={onClear} value="보살" />);

  fireEvent.click(screen.getByRole('button', { name: '입력 지우기' }));

  expect(onClear).toHaveBeenCalledTimes(1);
});

test.each([
  ['값이 비어 있으면', { value: '' }],
  ['비활성이면', { value: '보살', disabled: true }],
  ['읽기 전용이면', { value: '보살', readOnly: true }],
])('%s 지우기 버튼이 없다', (_, props) => {
  render(<TextField aria-label="닉네임" onChange={() => {}} onClear={() => {}} {...props} />);

  expect(screen.queryByRole('button', { name: '입력 지우기' })).not.toBeInTheDocument();
});

test('비활성 입력은 비활성 상태다', () => {
  render(<TextField aria-label="닉네임" disabled />);

  expect(screen.getByRole('textbox', { name: '닉네임' })).toBeDisabled();
});
