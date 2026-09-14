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
  shareId: '9f0d3f1e-0000-4000-8000-000000000001',
};

function renderAt(path: string) {
  const router = createMemoryRouter(
    [
      {
        path: '/reading/:id',
        element: (
          <ReadingResult
            ranking={<p>순위 자리</p>}
            renderCard={(face) => (
              <p>
                카드 자리 {face.nickname} {face.title}{' '}
                {face.grades.map((g) => `${g.label}${g.grade}`).join(' ')}
              </p>
            )}
            teaser={<p>티저 자리</p>}
            view={view}
          />
        ),
        children: [{ path: 'pre-register', element: <p>하위 화면</p> }],
      },
    ],
    { initialEntries: [path] },
  );
  render(<RouterProvider router={router} />);
}

test('카드 자리에 뷰 모델의 앞면 값을 넘기고 행운·운세 세 장을 그린다', () => {
  renderAt('/reading/abc');

  expect(
    screen.getByText('카드 자리 달빛토끼 꽃길만 걷는 인연 결혼운S 자녀운A 연애운B+'),
  ).toBeInTheDocument();
  expect(screen.getByText('행운의 장소').nextElementSibling).toHaveTextContent('만해광장');
  expect(screen.getByText('행운의 아이템').nextElementSibling).toHaveTextContent('작은 책 한 권');
  expect(
    screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent),
  ).toEqual(['결혼운', '자녀운', '연애운']);
  expect(screen.getByText('연애 풀이')).toBeInTheDocument();
});

test('다른 Phase 의 슬롯과 하위 라우트를 제자리에 그린다', () => {
  renderAt('/reading/abc/pre-register');

  expect(screen.getByText('순위 자리')).toBeInTheDocument();
  expect(screen.getByText('티저 자리')).toBeInTheDocument();
  expect(screen.getByText('하위 화면')).toBeInTheDocument();
});
