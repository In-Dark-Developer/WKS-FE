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

test('지도는 친구 수를 알리고 친구 모두를 구슬로 그린다', () => {
  render(<CompatibilityMap friends={friends} nickname="달빛토끼" />);

  const map = screen.getByRole('region', { name: '달빛토끼님의 궁합 지도' });
  expect(within(map).getByText('내 친구 6명과의 인연을 그린 지도에요')).toBeInTheDocument();
  const orbs = within(map).getAllByRole('listitem');
  expect(orbs).toHaveLength(6);
  expect(orbs[0]).toHaveTextContent('영채 귀인');
  expect(within(map).getByText('다정한친구')).toBeInTheDocument();
});

test('친구가 없으면 지도에 구슬 없이 안내한다', () => {
  render(<CompatibilityMap friends={[]} nickname="달빛토끼" />);

  expect(screen.getByText('아직 지도에 그린 인연이 없어요')).toBeInTheDocument();
  expect(screen.queryAllByRole('listitem')).toHaveLength(0);
});

test('친구가 2명 이하면 궤도 선만, 3명 이상이면 궤도 선과 구슬이 함께 도는 지도다', () => {
  const { rerender } = render(
    <CompatibilityMap friends={friends.slice(0, 2)} nickname="달빛토끼" />,
  );
  const map = screen.getByRole('region', { name: '달빛토끼님의 궁합 지도' });
  expect(map).toHaveAttribute('data-motion', 'orbits');

  rerender(<CompatibilityMap friends={friends.slice(0, 3)} nickname="달빛토끼" />);
  expect(map).toHaveAttribute('data-motion', 'orbs');

  rerender(<CompatibilityMap friends={[]} nickname="달빛토끼" />);
  expect(map).toHaveAttribute('data-motion', 'orbits');
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
  render(<FriendRanking friends={[]} shareAction={<button type="button">친구에게 공유</button>} />);

  expect(screen.getByRole('status')).toHaveTextContent('아직 인연이 없어요');
  expect(screen.getByRole('button', { name: '친구에게 공유' })).toBeInTheDocument();
});

test('내 지도는 공유 버튼을 지도 바로 아래, 순위보다 위에 그린다', () => {
  render(
    <CompatibilityMapScreen
      friends={friends}
      nickname="달빛토끼"
      share={<button type="button">친구에게 공유하고 궁합 지도 넓히기</button>}
    />,
  );

  expect(
    screen.getByRole('heading', { level: 1, name: '달빛토끼님의 궁합 지도' }),
  ).toBeInTheDocument();
  const share = screen.getByRole('button', { name: '친구에게 공유하고 궁합 지도 넓히기' });
  const map = screen.getByRole('region', { name: '달빛토끼님의 궁합 지도' });
  const ranking = screen.getByRole('heading', { name: '친구 궁합 순위' });
  expect(map.compareDocumentPosition(share) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(share.compareDocumentPosition(ranking) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});

test('방문자 지도는 링크 주인의 지도와 부제를 보이고 버튼 자리에 받은 버튼을 그린다', () => {
  render(
    <CompatibilityMapScreen
      friends={friends}
      nickname="달빛토끼"
      share={<button type="button">내 사주 내용도 확인하기</button>}
      variant="visitor"
    />,
  );

  const map = screen.getByRole('region', { name: '달빛토끼님의 궁합 지도' });
  expect(within(map).getByText('달빛토끼님과의 궁합 지도예요.')).toBeInTheDocument();
  expect(within(map).queryByText(/내 친구/)).not.toBeInTheDocument();
  expect(within(map).getAllByRole('listitem')).toHaveLength(6);
  expect(screen.getByRole('button', { name: '내 사주 내용도 확인하기' })).toBeInTheDocument();
});

test('방문자 지도는 친구가 없어도 같은 부제이고 순위 빈 상태는 내 지도와 같다', () => {
  render(<CompatibilityMapScreen friends={[]} nickname="달빛토끼" variant="visitor" />);

  expect(screen.getByText('달빛토끼님과의 궁합 지도예요.')).toBeInTheDocument();
  expect(screen.queryByText('아직 지도에 그린 인연이 없어요')).not.toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent('아직 인연이 없어요');
});

test('제목 줄 오른쪽에 받은 링크를 둔다', () => {
  render(<FriendRanking friends={friends} headerAction={<a href="/me/map">지도 보기 &gt;</a>} />);

  expect(screen.getByRole('link', { name: '지도 보기 >' })).toHaveAttribute('href', '/me/map');
});

test('뒤로가기 자리에 받은 버튼을 지도 위에 둔다', () => {
  render(
    <CompatibilityMapScreen
      back={<button type="button">뒤로가기</button>}
      friends={friends}
      nickname="달빛토끼"
    />,
  );

  const back = screen.getByRole('button', { name: '뒤로가기' });
  const heading = screen.getByRole('heading', { level: 1, name: '달빛토끼님의 궁합 지도' });
  expect(back.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});

test('뒤로가기를 주지 않으면 그 줄이 없다', () => {
  render(<CompatibilityMapScreen friends={friends} nickname="달빛토끼" />);

  expect(screen.queryByRole('button', { name: '뒤로가기' })).not.toBeInTheDocument();
});

test('인연이 있으면 공유 버튼을 목록 아래에 그린다', () => {
  render(
    <FriendRanking
      friends={[{ nickname: '영채', score: 94, tier: 'GUIIN' }]}
      shareAction={<button type="button">친구에게 공유</button>}
    />,
  );

  expect(screen.queryByRole('status')).not.toBeInTheDocument();
  const list = screen.getByRole('list');
  const button = screen.getByRole('button', { name: '친구에게 공유' });
  expect(list.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});

test('궁합 ID 가 있는 친구 줄만 눌러 궁합 이유를 열 수 있고, 그때 안내 문구가 보인다', () => {
  const onSelectFriend = vi.fn();
  render(
    <CompatibilityMapScreen
      friends={[
        { nickname: '영채', score: 94, tier: 'GUIIN', compatibilityId: 7 },
        { nickname: '진희', score: 83, tier: 'CHALTTEOK' },
      ]}
      nickname="달빛토끼"
      onSelectFriend={onSelectFriend}
    />,
  );

  expect(screen.getByText('친구 이름을 눌러 자세한 정보를 확인해보세요.')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '영채님과의 궁합 이유 보기' }));
  expect(onSelectFriend).toHaveBeenCalledWith(expect.objectContaining({ compatibilityId: 7 }));
  // ID 가 없는 줄(V1 이전 백엔드)은 버튼이 아니다.
  expect(
    screen.queryByRole('button', { name: '진희님과의 궁합 이유 보기' }),
  ).not.toBeInTheDocument();
});

test('줄을 고를 수 없으면 안내 문구가 없다', () => {
  render(<CompatibilityMapScreen friends={friends} nickname="달빛토끼" />);

  expect(
    screen.queryByText('친구 이름을 눌러 자세한 정보를 확인해보세요.'),
  ).not.toBeInTheDocument();
});
