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
  elements: { wood: 3, fire: 2, earth: 1, metal: 1, water: 1 },
  luckyItem: '작은 책 한 권',
  shareId: '9f0d3f1e-0000-4000-8000-000000000001',
  elementMatch: null,
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
  // Figma 사주 카드 화면(658:5087·658:5088) 순서: 아이템 → 장소, 운세는 연애 → 결혼 → 자녀.
  // 카드 아래 오행 다섯 장(982:3446) → 행운 두 장 순서다.
  expect(screen.getAllByRole('term').map((term) => term.textContent)).toEqual([
    '목',
    '화',
    '토',
    '금',
    '수',
    '행운의 아이템',
    '행운의 장소',
  ]);
  expect(screen.getByText('행운의 장소').nextElementSibling).toHaveTextContent('만해광장');
  expect(screen.getByText('행운의 아이템').nextElementSibling).toHaveTextContent('작은 책 한 권');
  expect(
    screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent),
  ).toEqual(['연애운', '결혼운', '자녀운']);
  expect(screen.getByText('연애 풀이')).toBeInTheDocument();
});

test('다른 Phase 의 슬롯과 하위 라우트를 제자리에 그린다', () => {
  renderAt('/reading/abc/pre-register');

  expect(screen.getByText('순위 자리')).toBeInTheDocument();
  expect(screen.getByText('티저 자리')).toBeInTheDocument();
  expect(screen.getByText('하위 화면')).toBeInTheDocument();
});

test('뒤로가기 자리에 받은 버튼을 카드 위에 둔다', () => {
  render(
    <ReadingResult
      back={<button type="button">뒤로가기</button>}
      renderCard={() => <p>카드 자리</p>}
      view={view}
    />,
  );

  const back = screen.getByRole('button', { name: '뒤로가기' });
  const card = screen.getByText('카드 자리');
  expect(back.compareDocumentPosition(card) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});

test('잘 맞는 오행이 있으면 오행 분포와 행운 사이에 이유와 소개팅 입구를 그린다', () => {
  render(
    <ReadingResult
      elementMatchAction={<a href="/dating">토 기운의 사람 만나보기 →</a>}
      renderCard={() => <p>카드 자리</p>}
      view={{
        ...view,
        elementMatch: { element: 'earth', korean: '토', reason: '흙의 기운이 당신을 살려요.' },
      }}
    />,
  );

  const section = screen.getByRole('region', { name: '나와 잘 맞는 오행' });
  expect(section).toHaveTextContent('토 (土)');
  expect(section).toHaveTextContent('흙의 기운이 당신을 살려요.');
  expect(screen.getByRole('link', { name: '토 기운의 사람 만나보기 →' })).toHaveAttribute(
    'href',
    '/dating',
  );
  const lucky = screen.getByText('행운의 아이템');
  expect(section.compareDocumentPosition(lucky) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});

test('옛 결과처럼 잘 맞는 오행이 없으면 그 영역만 그리지 않는다', () => {
  render(<ReadingResult renderCard={() => <p>카드 자리</p>} view={view} />);

  expect(screen.queryByRole('region', { name: '나와 잘 맞는 오행' })).not.toBeInTheDocument();
  expect(screen.getByText('행운의 아이템')).toBeInTheDocument();
});
