import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';

import { Field } from './Field';
import { TextArea } from './TextArea';

afterEach(() => {
  cleanup();
});

test('입력하면 글자 수 카운터가 바뀐다', () => {
  render(<Field label="자기소개">{(control) => <TextArea {...control} maxLength={200} />}</Field>);

  expect(screen.getByText('0 / 200')).toBeInTheDocument();

  fireEvent.change(screen.getByRole('textbox', { name: '자기소개' }), {
    target: { value: '안녕하세요' },
  });

  expect(screen.getByText('5 / 200')).toBeInTheDocument();
});

test('제어 값의 길이로 카운터를 센다', () => {
  render(<TextArea aria-label="자기소개" maxLength={10} onChange={() => {}} value="보살" />);

  expect(screen.getByText('2 / 10')).toBeInTheDocument();
});

test('maxLength 가 없으면 카운터가 없고, 비활성이면 비활성이다', () => {
  render(<TextArea aria-label="자기소개" disabled />);

  expect(screen.getByRole('textbox', { name: '자기소개' })).toBeDisabled();
  expect(screen.queryByText(/ \/ /)).not.toBeInTheDocument();
});
