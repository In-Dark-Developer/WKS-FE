import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import type { Friend } from '@/features/friends';

import { SharedResultScreen } from './SharedResultScreen';

afterEach(cleanup);

const friends: Friend[] = [
  { nickname: '민지', score: 95, tier: 'GUIIN' },
  { nickname: '서연', score: 88, tier: 'CHALTTEOK' },
  { nickname: '근우', score: 80, tier: 'BEOT' },
  { nickname: '도윤', score: 70, tier: 'BEOT' },
  { nickname: '하린', score: 60, tier: 'SEUCHIM' },
];

function renderAt(myRank: number) {
  const mine = friends[myRank - 1] as Friend;
  render(
    <SharedResultScreen
      friends={friends}
      mine={mine}
      myRank={myRank}
      onViewAll={vi.fn()}
      onViewMyReading={vi.fn()}
      ownerNickname="달빛토끼"
      reason={null}
    />,
  );
  const ranking = screen.getByRole('region', { name: '나의 궁합 순위' });
  return within(ranking)
    .getAllByRole('listitem')
    .map((row) => row.textContent);
}

test('나의 궁합 순위는 내 줄을 가운데 두고 바로 앞·뒤 순위를 함께 보인다 (Figma 15:1301)', () => {
  expect(renderAt(3)).toEqual(['2서연찰떡88점', '3근우벗80점', '4도윤벗70점']);
});

test('1등이면 앞 순위 없이 나와 다음 순위만 보인다', () => {
  expect(renderAt(1)).toEqual(['1민지귀인95점', '2서연찰떡88점']);
});

test('꼴찌면 앞 순위와 나만 보인다', () => {
  expect(renderAt(5)).toEqual(['4도윤벗70점', '5하린스침60점']);
});
