import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { PartnerEntryDialog } from './PartnerEntryDialog';

afterEach(() => {
  cleanup();
});

function renderDialog(overrides: Partial<Parameters<typeof PartnerEntryDialog>[0]> = {}) {
  const onLogin = vi.fn();
  const onClose = vi.fn();
  render(<PartnerEntryDialog onClose={onClose} onLogin={onLogin} open {...overrides} />);
  return { onLogin, onClose };
}

test('배너로 들어오면 받을 실 개수와 로그인 안내를 보여 준다 (SCR-23 1.1)', () => {
  renderDialog();

  const dialog = screen.getByRole('dialog');
  expect(dialog).toHaveAccessibleName('운명의 실');
  expect(dialog).toHaveTextContent('운명의 실을 통해 상대방의 정보를 확인하고,');
  expect(screen.getByLabelText('운명의 실 보유 10개')).toBeInTheDocument();
});

test('로그인 버튼은 로그인으로 보낸다 (Figma 1.1.1)', () => {
  const { onLogin, onClose } = renderDialog();

  fireEvent.click(screen.getByRole('button', { name: '바로 로그인하고 운명의 짝 찾아보기' }));

  expect(onLogin).toHaveBeenCalledOnce();
  expect(onClose).not.toHaveBeenCalled();
});

test.each(['나중에 사용할래요', '닫기'])('%s 는 모달만 닫는다 (Figma 1.3)', (name) => {
  const { onLogin, onClose } = renderDialog();

  fireEvent.click(screen.getByRole('button', { name }));

  expect(onClose).toHaveBeenCalledOnce();
  expect(onLogin).not.toHaveBeenCalled();
});

test('open 이 거짓이면 그리지 않는다', () => {
  renderDialog({ open: false });

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
