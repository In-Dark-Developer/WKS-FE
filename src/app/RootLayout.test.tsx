import { cleanup, render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterEach, expect, test } from 'vitest';

import { RootLayout } from './RootLayout';

afterEach(() => {
  cleanup();
});

function renderAt(path: string) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <RootLayout />,
        children: [
          { index: true, element: <p>입력</p> },
          {
            path: 'reading/:id',
            handle: { backdrop: 'result' },
            element: <p>결과</p>,
            children: [
              { path: 'pre-register', handle: { backdrop: 'mist' }, element: <p>신청</p> },
            ],
          },
          { path: 'odd', handle: { backdrop: 'neon' }, element: <p>이상한 값</p> },
        ],
      },
    ],
    { initialEntries: [path] },
  );
  render(<RouterProvider router={router} />);
}

test.each([
  ['/', '입력', 'dawn'],
  ['/reading/abc', '결과', 'result'],
  ['/reading/abc/pre-register', '결과', 'mist'],
  ['/odd', '이상한 값', 'dawn'],
])('%s 는 가장 깊은 라우트 handle 의 배경을 쓴다', async (path, text, backdrop) => {
  renderAt(path);

  expect(await screen.findByText(text)).toBeInTheDocument();
  expect(screen.getByRole('main')).toHaveAttribute('data-backdrop', backdrop);
});
