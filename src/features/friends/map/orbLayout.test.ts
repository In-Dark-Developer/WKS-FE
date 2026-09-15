import { expect, test } from 'vitest';

import { placeOrbs, tierOrbits, type PlacedOrb } from './orbLayout';
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

// 흐르는 궤도 둘레(한 주기에 도는 거리) 위에서 두 출발 위치 사이의 짧은 쪽 거리(px).
function loopGapPx(a: { phase: number; r: number; loop: number }, b: { phase: number }): number {
  const diff = Math.abs(a.phase - b.phase) % 1;
  const loopPx = (a.loop * Math.PI * a.r) / 180;
  return Math.min(diff, 1 - diff) * loopPx;
}

test('같은 친구는 늘 같은 자리이고, 같은 궤도 구슬 자리는 똑같이 나눈 칸에서 조금씩 비껴 난다', () => {
  const friends = friendsOf(['CHALTTEOK', 'CHALTTEOK', 'CHALTTEOK']);

  expect(placeOrbs(friends)).toEqual(placeOrbs(friends));
  const phases = placeOrbs(friends).map(({ travel }) => travel.phase);
  const gaps = phases.map((phase, i) => (phase - (phases[(i + 1) % phases.length] ?? 0) + 1) % 1);
  expect(gaps.some((gap) => Math.abs(gap - 1 / 3) > 0.001)).toBe(true);
});

test.each([
  ['귀인', 'GUIIN'],
  ['찰떡', 'CHALTTEOK'],
  ['벗', 'BEOT'],
  ['스침', 'SEUCHIM'],
] as const)(
  '%s 궤도에 몇 명이 흘러도 출발 간격이 44px 이상이고 보이는 호는 늘 10초에 지난다',
  (_name, tier) => {
    for (const count of [2, 3, 5, 12, 30]) {
      const travels = placeOrbs(friendsOf(Array.from({ length: count }, () => tier))).map(
        ({ travel }) => travel,
      );
      for (const [i, a] of travels.entries()) {
        expect((a.duration * a.span) / a.loop).toBeCloseTo(10, 6);
        expect(a.loop).toBeGreaterThanOrEqual(2 * a.span - 0.001);
        for (const b of travels.slice(i + 1)) {
          expect(loopGapPx(a, b)).toBeGreaterThanOrEqual(44 - 0.001);
        }
      }
    }
  },
);

test('붐비지 않는 궤도는 보이는 시간과 숨는 시간이 같다(한 주기 20초)', () => {
  const [travel] = placeOrbs(friendsOf(['GUIIN', 'GUIIN'])).map((orb) => orb.travel);

  expect(travel?.loop).toBeCloseTo(2 * (travel?.span ?? 0), 6);
  expect(travel?.duration).toBeCloseTo(20, 6);
});

test('보이는 호의 양 끝이 지도 칸 안이다', () => {
  const placed = placeOrbs(friendsOf(['BEOT', 'GUIIN', 'BEOT', 'BEOT']));
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
  // 궤도마다 출발을 엇갈린다.
  const guiin = placed.find(({ friend }) => friend.tier === 'GUIIN');
  const beot = placed.find(({ friend }) => friend.tier === 'BEOT');
  expect(guiin?.travel.phase).not.toBe(beot?.travel.phase);
});

test('흐르는 구슬은 멈춘 자리보다 긴 호(지도 패널 끝까지)를 흐르고, 멈춘 자리는 제목·닉네임 자리를 비운다', () => {
  for (const tier of tierOrder) {
    const [{ x, y, travel }] = placeOrbs(friendsOf([tier])) as [PlacedOrb];

    expect(x).toBeGreaterThanOrEqual(24);
    expect(x).toBeLessThanOrEqual(299);
    expect(y).toBeGreaterThanOrEqual(96);
    expect(y).toBeLessThanOrEqual(400);
    const radian = (travel.from * Math.PI) / 180;
    const startX = travel.cx + travel.r * Math.cos(radian);
    // 흐름 시작점은 멈춘 칸 밖(패널 가장자리 쪽)까지 나간다.
    expect(startX < 24 || travel.cy + travel.r * Math.sin(radian) < 96).toBe(true);
  }
});
