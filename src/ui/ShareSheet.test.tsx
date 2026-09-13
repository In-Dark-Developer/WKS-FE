import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import shareIcon from '@/ui/assets/icons/instagram.svg';

import { ShareSheet, type ShareOption } from './ShareSheet';

afterEach(() => {
  cleanup();
  document.body.style.overflow = '';
});

function options(onSelect: () => void): ShareOption[] {
  return [{ id: 'instagram', icon: shareIcon, label: '인스타 스토리 공유하기', onSelect }];
}

test('open 이 false 면 아무것도 그리지 않는다', () => {
  render(<ShareSheet onClose={vi.fn()} open={false} options={[]} />);

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('옵션을 누르면 onSelect 와 onClose 를 모두 부른다', () => {
  const onSelect = vi.fn();
  const onClose = vi.fn();
  render(<ShareSheet onClose={onClose} open options={options(onSelect)} />);

  fireEvent.click(screen.getByRole('button', { name: '인스타 스토리 공유하기' }));

  expect(onSelect).toHaveBeenCalledTimes(1);
  expect(onClose).toHaveBeenCalledTimes(1);
});

test('제목 기본값은 "공유하기"다', () => {
  render(<ShareSheet onClose={vi.fn()} open options={[]} />);

  expect(screen.getByRole('heading', { name: '공유하기' })).toBeInTheDocument();
});

test('Escape 를 누르면 onClose 가 불린다', () => {
  const onClose = vi.fn();
  render(<ShareSheet onClose={onClose} open options={[]} />);

  fireEvent.keyDown(document, { key: 'Escape' });

  expect(onClose).toHaveBeenCalledTimes(1);
});
