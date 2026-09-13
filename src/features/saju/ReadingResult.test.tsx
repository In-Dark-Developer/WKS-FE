import { cleanup, render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterEach, expect, test } from 'vitest';

import { ReadingResult } from './ReadingResult';
import type { ReadingView } from './readingView';

afterEach(cleanup);

const view: ReadingView = {
  nickname: '달빛토끼',
  zodiac: 'RAT',
  destiny: { title: '꽃길만 걷는 인연', description: '설명' },
  fortunes: {
    marriage: { grade: 'S', content: '결혼 풀이' },
    children: { grade: 'A', content: '자녀 풀이' },
    love: { grade: 'B+', content: '연애 풀이' },
  },
  luckyPlace: '만해광장',
  luckyItem: '작은 책 한 권',
};

function renderAt(path: string) {
  const router = createMemoryRouter(
    [
      {
        path: '/reading/:id',
        element: (
          <ReadingResult
            ranking={<p>순위 자리</p>}
            share={<button type="button">공유 자리</button>}
            teaser={<p>티저 자리</p>}
            view={view}
          />
        ),
        children: [{ path: 'card', element: <p>인연카드 하위 화면</p> }],
      },
    ],
    { initialEntries: [path] },
  );
  render(<RouterProvider router={router} />);
}

test('운명 카드·행운·운세 세 장을 뷰 모델대로 그린다', () => {
  renderAt('/reading/abc');

  expect(screen.getByRole('region', { name: '달빛토끼님의 운명 카드' })).toBeInTheDocument();
  expect(screen.getByRole('img', { name: 'S 등급' })).toBeInTheDocument();
  expect(screen.getByText('행운의 장소').nextElementSibling).toHaveTextContent('만해광장');
  expect(screen.getByText('행운의 아이템').nextElementSibling).toHaveTextContent('작은 책 한 권');
  expect(
    screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent),
  ).toEqual(['결혼운', '자녀운', '연애운']);
  expect(screen.getByText('연애 풀이')).toBeInTheDocument();
});

test('다른 Phase 의 슬롯과 하위 라우트를 제자리에 그린다', () => {
  renderAt('/reading/abc/card');

  expect(screen.getByRole('button', { name: '공유 자리' })).toBeInTheDocument();
  expect(screen.getByText('순위 자리')).toBeInTheDocument();
  expect(screen.getByText('티저 자리')).toBeInTheDocument();
  expect(screen.getByText('인연카드 하위 화면')).toBeInTheDocument();
});
