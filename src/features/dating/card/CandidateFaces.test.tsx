import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';

import { CandidateFront } from './CandidateFaces';

afterEach(cleanup);

const front = { rank: 1, relationLabel: '천생연분', mbti: 'ENTP', score: 92, bio: '안녕하세요' };

test('앞면 MBTI 옆에 나이를 년생으로 보인다 (Figma 448:2786)', () => {
  render(<CandidateFront {...front} birthYear="02년생" />);

  expect(screen.getByText('나이')).toBeInTheDocument();
  expect(screen.getByText('02년생')).toBeInTheDocument();
});

test('생년월일이 오지 않은 카드는 나이 칸을 그리지 않는다', () => {
  render(<CandidateFront {...front} birthYear={null} />);

  expect(screen.queryByText('나이')).not.toBeInTheDocument();
});
