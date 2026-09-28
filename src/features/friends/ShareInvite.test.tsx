import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';

import type { Friend } from './map/tiers';
import { ShareInvite } from './ShareInvite';

afterEach(cleanup);

const friends: Friend[] = [
  { nickname: '채원', score: 94, tier: 'GUIIN' },
  { nickname: '원영', score: 83, tier: 'CHALTTEOK' },
  { nickname: '유진', score: 76, tier: 'CHALTTEOK' },
  { nickname: '윈터', score: 68, tier: 'BEOT' },
  { nickname: '모카', score: 52, tier: 'SEUCHIM' },
];

test('링크 진입 초대의 주인 지도는 멈춰 있어 친구 구슬이 모두 보인다 (Figma 30:6128)', () => {
  render(<ShareInvite ownerFriends={friends} ownerNickname="원희" />);

  const map = screen.getByRole('region', { name: '원희님의 궁합 지도' });
  // 3명 이상이면 구슬이 흐르며 절반 동안 숨는 'orbs' 가 된다 — 초대 머리는 그러지 않는다.
  expect(map).toHaveAttribute('data-motion', 'none');
  for (const friend of friends) expect(screen.getByText(friend.nickname)).toBeInTheDocument();
});
