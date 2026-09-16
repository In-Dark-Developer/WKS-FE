import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';

import { ShareJoinLoading } from './ShareJoinLoading';

afterEach(cleanup);

test('만드는 중임을 알리고 문구를 읽어 준다', () => {
  render(<ShareJoinLoading />);

  const status = screen.getByRole('status');
  expect(status).toHaveAttribute('aria-busy', 'true');
  expect(status).toHaveTextContent('이전 정보로 궁합지도를 만들고 있어요');
});

test('늘어나는 점과 코끼리 그림은 읽어 주지 않는다', () => {
  const { container } = render(<ShareJoinLoading />);

  const dots = container.querySelectorAll('[data-share-join-dot]');
  expect(dots).toHaveLength(3);
  expect(dots[0]?.parentElement).toHaveAttribute('aria-hidden', 'true');
  expect(screen.getByRole('presentation', { hidden: true })).toBeInTheDocument();
});
