import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';

import type { ReadingView } from '../readingView';
import { FortuneSection } from './FortuneSection';

afterEach(cleanup);

const fortunes: ReadingView['fortunes'] = {
  marriage: { grade: 'S', content: '결혼운 설명' },
  children: { grade: 'A', content: '자녀운 설명' },
  love: { grade: 'B+', content: '연애운 설명' },
};

// QA(2026-09-28): 홈 운세가 백엔드 응답 순서(결혼·자녀·연애)로 보였다 — 화면이 정한 순서를 따라야 한다.
test('운세 카드는 연애운 → 결혼운 → 자녀운 순으로 보인다 (Figma 8:794)', () => {
  render(<FortuneSection fortunes={fortunes} />);

  const headings = screen.getAllByRole('heading', { level: 3 }).map((node) => node.textContent);

  expect(headings).toEqual(['연애운', '결혼운', '자녀운']);
});

test('각 카드는 그 운세의 설명을 그린다', () => {
  render(<FortuneSection fortunes={fortunes} />);

  expect(screen.getByText('연애운 설명')).toBeInTheDocument();
  expect(screen.getByText('결혼운 설명')).toBeInTheDocument();
  expect(screen.getByText('자녀운 설명')).toBeInTheDocument();
});
