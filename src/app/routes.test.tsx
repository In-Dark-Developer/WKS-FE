import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { expect, test } from 'vitest';

import { routes } from '@/app/routes';

test('루트 경로가 화면을 렌더한다', () => {
  render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/'] })} />);

  expect(screen.getByRole('heading', { name: '운꿰사' })).toBeInTheDocument();
});
