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

// QA(2026-09-29): 링크로 들어온 화면의 지도가 선·구슬 모두 멈춰 있었다.
test('링크 진입 초대의 주인 지도도 움직인다 — 구슬 여러 개면 구슬만 돈다', () => {
  render(<ShareInvite ownerFriends={friends} ownerNickname="원희" />);

  const map = screen.getByRole('region', { name: '원희님의 궁합 지도' });
  expect(map).toHaveAttribute('data-motion', 'orbs');
  for (const friend of friends) expect(screen.getByText(friend.nickname)).toBeInTheDocument();
});

test('링크 주인의 친구가 1명이면 구슬은 제자리에 있고 궤도 선만 돈다', () => {
  render(<ShareInvite ownerFriends={friends.slice(0, 1)} ownerNickname="원희" />);

  expect(screen.getByRole('region', { name: '원희님의 궁합 지도' })).toHaveAttribute(
    'data-motion',
    'orbits',
  );
});
