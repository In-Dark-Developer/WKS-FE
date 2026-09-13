import { cleanup, render } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterEach, expect, test } from 'vitest';

import { previewScreens } from './previewScreens';

afterEach(cleanup);

test('screens 폴더의 화면이 목록에 뜨고 사주 입력이 첫 항목이다', () => {
  expect(previewScreens[0]?.slug).toBe('saju');
  expect(previewScreens.every(({ slug }) => !slug.endsWith('.test'))).toBe(true);
});

test('등록된 화면마다 상태가 하나 이상 있고 모두 렌더된다', () => {
  for (const { screen } of previewScreens) {
    const states = Object.values(screen.states);
    expect(states.length).toBeGreaterThan(0);

    for (const State of states) {
      const router = createMemoryRouter([{ path: '/', Component: State }]);
      const { unmount } = render(<RouterProvider router={router} />);
      unmount();
    }
  }
});
