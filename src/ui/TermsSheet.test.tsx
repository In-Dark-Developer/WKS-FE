import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { TermsSheet } from './TermsSheet';

afterEach(cleanup);

test('닫혀 있으면 아무것도 그리지 않는다', () => {
  render(<TermsSheet onClose={vi.fn()} open={false} />);

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('약관 네 절을 보이고 확인으로 닫는다', () => {
  const onClose = vi.fn();
  render(<TermsSheet onClose={onClose} open />);

  expect(screen.getByRole('dialog', { name: '이용약관 / 개인정보 및 사주 결과 안내' })).toBeInTheDocument();
  expect(screen.getByText('[개인정보 보호 안내]')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '확인' }));

  expect(onClose).toHaveBeenCalledOnce();
});
