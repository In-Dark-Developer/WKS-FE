import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Form, RouterProvider, createMemoryRouter, useActionData } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';

import type { PreviewEntry } from './previewScreens';

import { PreviewRoute, previewAction } from './PreviewRoute';

function Filled() {
  return <p>채운 상태</p>;
}

function Empty() {
  return <p>빈 상태</p>;
}

function Submitting() {
  const data = useActionData();
  return (
    <Form method="post">
      <button type="submit">제출</button>
      {data === 'fake-result' ? <p>가짜 응답</p> : null}
    </Form>
  );
}

const fakeScreens: PreviewEntry[] = [
  { slug: 'card', screen: { title: '카드', order: 0, states: { 채움: Filled, 비움: Empty } } },
  {
    slug: 'form',
    screen: { title: '폼', order: 1, states: { 기본: Submitting }, action: () => 'fake-result' },
  },
];

// vi.mock 은 파일 맨 위로 올라가므로 fakeScreens 는 렌더할 때 읽는다.
vi.mock('./previewScreens', () => ({
  get previewScreens() {
    return fakeScreens;
  },
  findPreviewScreen: (slug: string | undefined) => fakeScreens.find((entry) => entry.slug === slug),
}));

afterEach(cleanup);

function renderAt(path: string) {
  const router = createMemoryRouter(
    [{ path: '/preview/*', Component: PreviewRoute, action: previewAction }],
    { initialEntries: [path] },
  );
  render(<RouterProvider router={router} />);
}

test('/preview 는 등록된 화면을 순서대로 링크한다', () => {
  renderAt('/preview');

  const links = screen.getAllByRole('link');
  expect(links.map((link) => link.getAttribute('href'))).toEqual([
    '/preview/card',
    '/preview/form',
  ]);
});

test('화면은 첫 상태로 뜨고 상태 링크로 바꿔 볼 수 있다', async () => {
  renderAt('/preview/card');
  expect(screen.getByText('채운 상태')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('link', { name: '비움' }));

  expect(await screen.findByText('빈 상태')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: '비움' })).toHaveAttribute('aria-current', 'page');
});

test('상태가 하나뿐이면 상태 링크를 보이지 않는다', () => {
  renderAt('/preview/form');

  expect(screen.queryByRole('link', { name: '기본' })).not.toBeInTheDocument();
});

test('없는 화면은 안내와 목록 링크를 보인다', () => {
  renderAt('/preview/nope');

  expect(screen.getByText(/등록되지 않은 화면이에요/)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: '목록으로' })).toHaveAttribute('href', '/preview');
});

test('화면이 제출하면 그 화면의 action 응답을 받는다', async () => {
  renderAt('/preview/form');

  fireEvent.click(screen.getByRole('button', { name: '제출' }));

  expect(await screen.findByText('가짜 응답')).toBeInTheDocument();
});
