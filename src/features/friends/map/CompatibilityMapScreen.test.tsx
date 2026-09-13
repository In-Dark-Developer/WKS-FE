import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { CompatibilityMap } from './CompatibilityMap';
import { CompatibilityMapScreen } from './CompatibilityMapScreen';
import { FriendRanking } from './FriendRanking';
import { RelationStats } from './RelationStats';
import type { Friend } from './tiers';

afterEach(cleanup);

const friends: Friend[] = [
  { nickname: '영채', score: 94, tier: 'GUIIN' },
  { nickname: '진희', score: 83, tier: 'CHALTTEOK' },
  { nickname: '유민', score: 76, tier: 'CHALTTEOK' },
  { nickname: '선우', score: 68, tier: 'BEOT' },
  { nickname: '성준', score: 52, tier: 'SEUCHIM' },
  { nickname: '다정한친구', score: 61, tier: 'BEOT' },
];

test('지도는 친구 수를 알리고 구슬은 앞의 다섯 명까지 그린다', () => {
  render(<CompatibilityMap friends={friends} nickname="달빛토끼" />);

  const map = screen.getByRole('region', { name: '달빛토끼님의 궁합 지도' });
  expect(within(map).getByText('내 친구 6명과의 인연을 그린 지도에요')).toBeInTheDocument();
  const orbs = within(map).getAllByRole('listitem');
  expect(orbs).toHaveLength(5);
  expect(orbs[0]).toHaveTextContent('영채 귀인');
  expect(within(map).queryByText('다정한친구')).not.toBeInTheDocument();
});

test('친구가 없으면 지도에 구슬 없이 안내한다', () => {
  render(<CompatibilityMap friends={[]} nickname="달빛토끼" />);

  expect(screen.getByText('아직 지도에 그린 인연이 없어요')).toBeInTheDocument();
  expect(screen.queryAllByRole('listitem')).toHaveLength(0);
});

test('등급별 인원을 네 칸에 센다', () => {
  render(<RelationStats friends={friends} />);

  const counts = screen.getAllByRole('definition').map((count) => count.textContent);
  expect(screen.getAllByRole('term').map((term) => term.textContent)).toEqual([
    '귀인',
    '찰떡',
    '벗',
    '스침',
  ]);
  expect(counts).toEqual(['1', '2', '2', '1']);
});

test('순위 목록은 받은 순서대로 순위·닉네임·등급·점수를 보이고 limit 만큼 자른다', () => {
  render(<FriendRanking friends={friends} limit={3} />);

  const rows = screen.getAllByRole('listitem');
  expect(rows).toHaveLength(3);
  expect(rows[1]).toHaveTextContent('2진희찰떡83점');
});

test('인연이 없으면 안내와 버튼 자리를 보인다', () => {
  render(<FriendRanking emptyAction={<button type="button">친구에게 공유</button>} friends={[]} />);

  expect(screen.getByRole('status')).toHaveTextContent('아직 인연이 없어요');
  expect(screen.getByRole('button', { name: '친구에게 공유' })).toBeInTheDocument();
});

test('공유 버튼을 누르면 onShare 를 부른다', () => {
  const onShare = vi.fn();
  render(<CompatibilityMapScreen friends={friends} nickname="달빛토끼" onShare={onShare} />);

  expect(
    screen.getByRole('heading', { level: 1, name: '달빛토끼님의 궁합 지도' }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '친구에게 공유하고 궁합 지도 넓히기' }));
  expect(onShare).toHaveBeenCalledOnce();
});
