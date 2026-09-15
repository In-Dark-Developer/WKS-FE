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

test('흐르는 구슬은 같은 궤도끼리 주기를 똑같이 나눠 출발하고, 보이는 호의 양 끝이 지도 칸 안이다', () => {
  const placed = placeOrbs(friendsOf(['BEOT', 'GUIIN', 'BEOT', 'BEOT']));
  const beot = placed.filter(({ friend }) => friend.tier === 'BEOT').map(({ travel }) => travel);

  const gaps = beot.map(({ phase }) => (phase - (beot[0]?.phase ?? 0) + 1) % 1);
  expect(gaps.map((gap) => gap.toFixed(6))).toEqual([0, 1 / 3, 2 / 3].map((gap) => gap.toFixed(6)));
  // 귀인은 벗과 다른 출발(엇갈림)이다.
  const guiin = placed.find(({ friend }) => friend.tier === 'GUIIN');
  expect(guiin?.travel.phase).not.toBe(beot[0]?.phase);
  for (const { cx, cy, r, from, span } of placed.map(({ travel }) => travel)) {
    expect(span).toBeGreaterThan(0);
    for (const degree of [from, from + span]) {
      const radian = (degree * Math.PI) / 180;
      const x = cx + r * Math.cos(radian);
      const y = cy + r * Math.sin(radian);
      expect(x).toBeGreaterThan(0);
      expect(x).toBeLessThan(323);
      expect(y).toBeGreaterThan(0);
      expect(y).toBeLessThan(439);
    }
  }
});
