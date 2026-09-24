import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { ShareEntryChoice } from './ShareEntryChoice';

afterEach(cleanup);

test('링크 주인 닉네임과 두 선택지를 보인다', () => {
  render(<ShareEntryChoice onReusePrevious={vi.fn()} onWriteNew={vi.fn()} ownerNickname="서연" />);

  expect(screen.getByRole('region', { name: '운명도 꿰어야 사랑이다' })).toHaveTextContent('서연');
  expect(screen.getByRole('button', { name: '이전 정보 불러오기' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '새로 작성하기' })).toBeInTheDocument();
});

test('누른 선택지의 콜백만 부른다', () => {
  const onReusePrevious = vi.fn();
  const onWriteNew = vi.fn();
  render(
    <ShareEntryChoice
      onReusePrevious={onReusePrevious}
      onWriteNew={onWriteNew}
      ownerNickname="서연"
    />,
  );

  fireEvent.click(screen.getByRole('button', { name: '새로 작성하기' }));
  expect(onWriteNew).toHaveBeenCalledOnce();
  expect(onReusePrevious).not.toHaveBeenCalled();

  fireEvent.click(screen.getByRole('button', { name: '이전 정보 불러오기' }));
  expect(onReusePrevious).toHaveBeenCalledOnce();
});
