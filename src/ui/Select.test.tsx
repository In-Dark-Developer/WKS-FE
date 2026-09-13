import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { Field } from './Field';
import { Select } from './Select';

afterEach(() => {
  cleanup();
});

const options = [
  { value: 'JA', label: '자시(子時) 23:30 ~ 01:30' },
  { value: 'CHUK', label: '축시(丑時) 01:30 ~ 03:30' },
  { value: 'IN', label: '인시(寅時) 03:30 ~ 05:30' },
] as const;

function renderSelect(props: Partial<Parameters<typeof Select>[0]> = {}) {
  const onChange = vi.fn();
  render(
    <Field label="태어난 시간">
      {(control) => (
        <Select
          {...control}
          name="birthTime"
          onChange={onChange}
          options={options}
          placeholder="시간을 선택해 주세요"
          value={null}
          {...props}
        />
      )}
    </Field>,
  );
  return { onChange, trigger: screen.getByRole('combobox', { name: '태어난 시간' }) };
}

test('누르면 옵션 목록이 열리고 고른 값으로 onChange 를 부른다', () => {
  const { onChange, trigger } = renderSelect();

  expect(trigger).toHaveTextContent('시간을 선택해 주세요');
  expect(trigger).toHaveAttribute('aria-expanded', 'false');

  fireEvent.click(trigger);
  expect(trigger).toHaveAttribute('aria-expanded', 'true');

  fireEvent.click(screen.getByRole('option', { name: '축시(丑時) 01:30 ~ 03:30' }));

  expect(onChange).toHaveBeenCalledWith('CHUK');
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('키보드로 열고 옮기고 고른다', () => {
  const { onChange, trigger } = renderSelect();

  fireEvent.keyDown(trigger, { key: 'ArrowDown' });
  fireEvent.keyDown(trigger, { key: 'ArrowDown' });
  fireEvent.keyDown(trigger, { key: 'ArrowDown' });
  fireEvent.keyDown(trigger, { key: 'Enter' });

  expect(onChange).toHaveBeenCalledWith('IN');
});

test('Escape 는 고르지 않고 닫는다', () => {
  const { onChange, trigger } = renderSelect();

  fireEvent.keyDown(trigger, { key: 'Enter' });
  fireEvent.keyDown(trigger, { key: 'Escape' });

  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(onChange).not.toHaveBeenCalled();
});

test('선택된 값을 보이고 폼 전송용 hidden 값을 갖는다', () => {
  const { trigger } = renderSelect({ value: 'JA' });

  expect(trigger).toHaveTextContent('자시(子時) 23:30 ~ 01:30');
  expect(document.querySelector('input[name="birthTime"]')).toHaveValue('JA');

  fireEvent.click(trigger);
  expect(screen.getByRole('option', { name: '자시(子時) 23:30 ~ 01:30' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
});

test.each([
  ['비활성', { disabled: true }],
  ['읽기 전용', { readOnly: true }],
])('%s 이면 펼쳐지지 않는다', (_, props) => {
  const { trigger } = renderSelect(props);

  fireEvent.click(trigger);
  fireEvent.keyDown(trigger, { key: 'Enter' });

  expect(trigger).toHaveAttribute('aria-expanded', 'false');
});
