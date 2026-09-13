import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { Button } from './Button';

afterEach(() => {
  cleanup();
});

test.each(['primary', 'accent', 'secondary', 'ghost'] as const)(
  '%s 버튼은 라벨로 찾을 수 있고 누르면 onClick 을 부른다',
  (variant) => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} variant={variant}>
        점지 확인하기
      </Button>,
    );

    const button = screen.getByRole('button', { name: '점지 확인하기' });
    fireEvent.click(button);

    expect(button).toHaveAttribute('type', 'button');
    expect(onClick).toHaveBeenCalledTimes(1);
  },
);

test('비활성 버튼은 누를 수 없다', () => {
  const onClick = vi.fn();
  render(
    <Button disabled onClick={onClick}>
      점지 확인하기
    </Button>,
  );

  fireEvent.click(screen.getByRole('button', { name: '점지 확인하기' }));

  expect(onClick).not.toHaveBeenCalled();
});

test('로딩 중에는 로딩 문구를 보이고 누를 수 없다', () => {
  const onClick = vi.fn();
  render(
    <Button loading onClick={onClick}>
      점지 확인하기
    </Button>,
  );

  const button = screen.getByRole('button', { name: '처리 중' });
  fireEvent.click(button);

  expect(button).toHaveAttribute('aria-busy', 'true');
  expect(button).toBeDisabled();
  expect(onClick).not.toHaveBeenCalled();
});

test('submit 타입을 지정할 수 있다', () => {
  render(<Button type="submit">제출</Button>);

  expect(screen.getByRole('button', { name: '제출' })).toHaveAttribute('type', 'submit');
});
