import { expect, test } from 'vitest';

import { placeOrbs, tierOrbits } from './orbLayout';
import { tierLooks, tierOrder, type CompatibilityTier, type Friend } from './tiers';

function friendsOf(tiers: CompatibilityTier[]): Friend[] {
  return tiers.map((tier, index) => ({ nickname: `친구${index}`, score: 90 - index, tier }));
}

const MOON = { x: 36.53, y: 431.58 };

test('구슬은 자기 등급 색 궤도 위에 놓인다', () => {
  for (const { friend, x, y } of placeOrbs(friendsOf([...tierOrder]))) {
    const orbit = tierOrbits[friend.tier];
    const onEllipse = ((x - orbit.cx) / orbit.rx) ** 2 + ((y - orbit.cy) / orbit.ry) ** 2;
    expect(onEllipse).toBeCloseTo(1, 6);
  }
});

test('달에서 가까운 궤도부터 귀인·찰떡·벗·스침 순이다', () => {
  const distances = placeOrbs(friendsOf([...tierOrder])).map(({ x, y }) =>
    Math.hypot(x - MOON.x, y - MOON.y),
  );

  expect([...distances].sort((a, b) => a - b)).toEqual(distances);
});

test.each([
  ['한 등급 다섯 명', ['GUIIN', 'GUIIN', 'GUIIN', 'GUIIN', 'GUIIN']],
  ['스침 다섯 명', ['SEUCHIM', 'SEUCHIM', 'SEUCHIM', 'SEUCHIM', 'SEUCHIM']],
  ['섞인 다섯 명', ['GUIIN', 'CHALTTEOK', 'CHALTTEOK', 'BEOT', 'SEUCHIM']],
] as const)('%s — 구슬끼리 겹치지 않고 지도 칸 안에 있다', (_name, tiers) => {
  const placed = placeOrbs(friendsOf([...tiers]));

  for (const { x, y } of placed) {
    expect(x).toBeGreaterThanOrEqual(0);
    expect(x).toBeLessThanOrEqual(323);
    expect(y).toBeGreaterThanOrEqual(0);
    expect(y).toBeLessThanOrEqual(439);
  }
  for (const [i, a] of placed.entries()) {
    for (const b of placed.slice(i + 1)) {
      const gap = Math.hypot(a.x - b.x, a.y - b.y);
      expect(gap).toBeGreaterThan(
        (tierLooks[a.friend.tier].orbSize + tierLooks[b.friend.tier].orbSize) / 2,
      );
    }
  }
});
