import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { UnlockDialog } from './UnlockDialog';
import { UnlockDoneDialog } from './UnlockDoneDialog';
import type { UnlockOptionView } from './unlockView';

afterEach(cleanup);

const options: readonly UnlockOptionView[] = [
  { item: 'photo', cost: 10, isUnlocked: true },
  { item: 'name', cost: 7, isUnlocked: false },
  { item: 'department', cost: 5, isUnlocked: false },
  { item: 'reason', cost: 3, isUnlocked: false },
];

function renderDialog(balance = 20) {
  const onConfirm = vi.fn();
  render(
    <UnlockDialog
      balance={balance}
      onClose={vi.fn()}
      onConfirm={onConfirm}
      open
      options={options}
    />,
  );
  return { onConfirm };
}

test('아무것도 고르지 않으면 사용하기를 누를 수 없고, 이미 연 항목은 고를 수 없다', () => {
  renderDialog();

  expect(screen.getByRole('button', { name: '사용하기' })).toBeDisabled();
  expect(screen.getByRole('button', { name: /사진/ })).toBeDisabled();
});

test('여러 항목을 고르면 버튼에 비용 합을 적고, 고른 항목들을 넘긴다', () => {
  const { onConfirm } = renderDialog();

  fireEvent.click(screen.getByRole('button', { name: /이름/ }));
  fireEvent.click(screen.getByRole('button', { name: /궁합 이유/ }));

  expect(screen.getByRole('button', { name: /이름/ })).toHaveAttribute('aria-pressed', 'true');
  fireEvent.click(screen.getByRole('button', { name: '10개 사용하기' }));

  expect(onConfirm).toHaveBeenCalledWith(['name', 'reason']);
});

test('고른 비용이 잔액보다 많으면 알리고 막는다', () => {
  renderDialog(4);

  fireEvent.click(screen.getByRole('button', { name: /학과/ }));

  expect(screen.getByRole('alert')).toHaveTextContent('운명의 실이 부족해요.');
  expect(screen.getByRole('button', { name: '5개 사용하기' })).toBeDisabled();
});

test('구매 완료는 연 항목을 이름으로 알린다', () => {
  render(<UnlockDoneDialog balance={0} items={['department', 'name']} onClose={vi.fn()} open />);

  expect(screen.getByRole('dialog', { name: /정보를 열었어요!/ })).toBeVisible();
  expect(screen.getByText('학과, 이름')).toBeVisible();
  expect(screen.getByLabelText('운명의 실 보유 0개')).toBeVisible();
});
