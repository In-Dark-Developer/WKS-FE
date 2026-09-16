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

  expect(
    screen.getByRole('dialog', { name: '이용약관 / 개인정보 및 사주 결과 안내' }),
  ).toBeInTheDocument();
  expect(screen.getByText('[개인정보 보호 안내]')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '확인' }));

  expect(onClose).toHaveBeenCalledOnce();
});

test('[동의] 절은 켰을 때만 맨 끝에 보인다', () => {
  const { rerender } = render(<TermsSheet onClose={vi.fn()} open />);
  expect(screen.queryByText('[동의]')).not.toBeInTheDocument();

  rerender(<TermsSheet onClose={vi.fn()} open withConsentClause />);
  const headings = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
  expect(headings.at(-1)).toBe('[동의]');
  expect(
    screen.getByText(
      '‘점지 확인’을 누르시면 위 내용을 확인하였으며, 개인정보 수집·이용 및 사주 결과 제공에 동의한 것으로 간주됩니다.',
    ),
  ).toBeInTheDocument();
});
