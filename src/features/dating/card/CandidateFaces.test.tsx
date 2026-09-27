import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { CandidateBack, CandidateFront } from './CandidateFaces';

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

const photo = { isLocked: false, url: '/photo.webp' } as const;

test('해금은 됐는데 값이 아직 없는 항목은 0개가 아니라 다시 열기로 보인다', () => {
  render(
    <CandidateBack
      department={{ isLocked: false, value: '경영학과' }}
      name={{ isLocked: true, cost: 7 }}
      onUnlock={vi.fn()}
      photo={photo}
      reason={{ isLocked: true, cost: 0 }}
    />,
  );

  expect(screen.getByRole('button', { name: /궁합 이유 다시 열기/ })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /이름 7개로 열기/ })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /0개로 열기/ })).not.toBeInTheDocument();
});
