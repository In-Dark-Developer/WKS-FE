import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { RerollSheet } from './RerollSheet';

afterEach(cleanup);

function renderSheet(cost: number) {
  render(
    <RerollSheet
      onClose={vi.fn()}
      onConfirm={vi.fn()}
      open
      reroll={{ kind: 'paid', cost, canAfford: true }}
    />,
  );
}

test('할인 중인 유료 리롤은 정가 20 에 취소선을 긋고 지금 비용으로 버튼을 적는다', () => {
  renderSheet(10);

  const button = screen.getByRole('button', { name: '실 10개로 지금 변경하기' });
  expect(button.querySelector('s')).toHaveTextContent('20');
});

test('정가 리롤은 취소선이 없다', () => {
  renderSheet(20);

  const button = screen.getByRole('button', { name: '실 20개로 지금 변경하기' });
  expect(button.querySelector('s')).toBeNull();
});
