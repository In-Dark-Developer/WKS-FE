import { cleanup, render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';

import { RouteError } from './RouteError';
import { RouteLoading } from './RouteLoading';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

test('loader 가 던진 오류는 원인을 숨기고 공통 오류 화면을 보인다', async () => {
  const log = vi.spyOn(console, 'error').mockImplementation(() => {});
  const router = createMemoryRouter([
    {
      path: '/',
      errorElement: <RouteError />,
      loader: () => {
        throw new Error('schema mismatch');
      },
      element: <p>본문</p>,
    },
  ]);
  render(<RouterProvider router={router} />);

  const alert = await screen.findByRole('alert');
  expect(alert).toHaveTextContent('보살님이 잠시 길을 잃었어요');
  expect(alert).not.toHaveTextContent('schema mismatch');
  expect(log).toHaveBeenCalled();
});

test('첫 진입 loader 가 끝나기 전에는 대기 화면을 보인다', async () => {
  let finish = () => {};
  const pending = new Promise<null>((resolve) => {
    finish = () => resolve(null);
  });
  const router = createMemoryRouter([
    { path: '/', HydrateFallback: RouteLoading, loader: () => pending, element: <p>본문</p> },
  ]);
  render(<RouterProvider router={router} />);

  expect(screen.getByRole('status')).toHaveTextContent('보살님이 살펴보고 있어요');

  finish();
  expect(await screen.findByText('본문')).toBeInTheDocument();
});
