import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';

import { Field } from './Field';
import { TextField } from './TextField';

afterEach(() => {
  cleanup();
});

test('라벨과 도움말이 컨트롤에 연결된다', () => {
  render(
    <Field help="숫자 8자리로 입력해 주세요." label="생년월일">
      {(control) => <TextField {...control} placeholder="예: 20020101" />}
    </Field>,
  );

  const input = screen.getByRole('textbox', { name: '생년월일' });

  expect(input).toHaveAccessibleDescription('숫자 8자리로 입력해 주세요.');
  expect(input).not.toHaveAttribute('aria-invalid');
});

test('에러가 있으면 도움말 대신 에러를 알리고 컨트롤을 invalid 로 표시한다', () => {
  render(
    <Field
      error="생년월일을 숫자 8자리로 작성해 주세요"
      help="숫자 8자리로 입력해 주세요."
      label="생년월일"
    >
      {(control) => <TextField {...control} />}
    </Field>,
  );

  const input = screen.getByRole('textbox', { name: '생년월일' });

  expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(input).toHaveAccessibleDescription('생년월일을 숫자 8자리로 작성해 주세요');
  expect(screen.queryByText('숫자 8자리로 입력해 주세요.')).not.toBeInTheDocument();
});

test('비활성 필드는 컨트롤을 비활성으로 만든다', () => {
  render(
    <Field disabled label="닉네임" success="사용할 수 있어요">
      {(control) => <TextField {...control} />}
    </Field>,
  );

  const input = screen.getByRole('textbox', { name: '닉네임' });

  expect(input).toBeDisabled();
  expect(input).toHaveAccessibleDescription('사용할 수 있어요');
});
