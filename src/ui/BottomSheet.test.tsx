import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { BottomSheet } from './BottomSheet';

afterEach(() => {
  cleanup();
  document.body.style.overflow = '';
});

test('open 이 false 면 아무것도 그리지 않는다', () => {
  render(
    <BottomSheet label="시트" onClose={vi.fn()} open={false}>
      내용
    </BottomSheet>,
  );

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('열리면 label 을 이름으로 가진 대화상자에 children 을 그리고 첫 버튼에 포커스를 준다', () => {
  render(
    <BottomSheet label="새로운 인연" onClose={vi.fn()} open>
      <button type="button">변경하기</button>
    </BottomSheet>,
  );

  expect(screen.getByRole('dialog', { name: '새로운 인연' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '변경하기' })).toHaveFocus();
});

test('Escape 를 누르면 onClose 가 불린다', () => {
  const onClose = vi.fn();
  render(
    <BottomSheet label="시트" onClose={onClose} open>
      내용
    </BottomSheet>,
  );

  fireEvent.keyDown(document, { key: 'Escape' });

  expect(onClose).toHaveBeenCalledTimes(1);
});
