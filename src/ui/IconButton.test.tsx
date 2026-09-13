import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import closeIcon from '@/ui/assets/icons/close.svg';

import { IconButton } from './IconButton';

afterEach(() => {
  cleanup();
});

test('아이콘 버튼은 label 을 접근 가능한 이름으로 갖는다', () => {
  const onClick = vi.fn();
  render(<IconButton icon={closeIcon} label="닫기" onClick={onClick} />);

  fireEvent.click(screen.getByRole('button', { name: '닫기' }));

  expect(onClick).toHaveBeenCalledTimes(1);
});

test('비활성 아이콘 버튼은 누를 수 없다', () => {
  const onClick = vi.fn();
  render(
    <IconButton appearance="surface" disabled icon={closeIcon} label="닫기" onClick={onClick} />,
  );

  const button = screen.getByRole('button', { name: '닫기' });
  fireEvent.click(button);

  expect(button).toBeDisabled();
  expect(onClick).not.toHaveBeenCalled();
});
