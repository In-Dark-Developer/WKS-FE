import type { CompatibilityTier, Friend } from './tiers';

// 등급별 궤도 — 궤도 선 에셋(compatibility-orbit-*.svg)의 중심과 반지름(패널 323 × 439px 기준). 선 색이 구슬 색과 같은
// 궤도다: 귀인 #91BDC8 · 찰떡 #E9947D · 벗 #F9CB85 · 스침 #C3C6C9. 찰떡 궤도는 -87.74° 기울어진 거의 원(208.66 × 209.2)이라
// 원으로 본다.
export const tierOrbits: Record<
  CompatibilityTier,
  { cx: number; cy: number; rx: number; ry: number }
> = {
  GUIIN: { cx: 37.47, cy: 432.53, rx: 149.736, ry: 149.736 },
  CHALTTEOK: { cx: 46.12, cy: 423.34, rx: 208.93, ry: 208.93 },
  BEOT: { cx: 60.72, cy: 414.69, rx: 271.903, ry: 267.579 },
  SEUCHIM: { cx: 64.5, cy: 405.5, rx: 326.5, ry: 326.5 },
};

// 구슬 중심이 들어갈 칸 — 좌우 끝, 위의 제목, 아래 닉네임 자리를 비운다.
const bounds = { left: 24, right: 299, top: 96, bottom: 400 };

// x·y — 멈춘 자리(친구 2명 이하·동작 줄이기). travel — 흐르는 구슬(3명 이상): 궤도 중심 (cx, cy)·반지름 r 의 원을
// from° 에서 시작해 보이는 호 span° 를 한 주기의 앞 절반 동안 지나고, 뒤 절반은 보이지 않는 span° 를 더 간다.
// phase 는 주기 안의 출발 위치(0~1) — 같은 궤도 친구끼리 똑같이 나눠 간격이 늘 같고, 궤도마다 엇갈린다.
export type PlacedOrb = {
  friend: Friend;
  x: number;
  y: number;
  travel: { cx: number; cy: number; r: number; from: number; span: number; phase: number };
};

function pointAt(tier: CompatibilityTier, degree: number) {
  const orbit = tierOrbits[tier];
  const radian = (degree * Math.PI) / 180;
  return { x: orbit.cx + orbit.rx * Math.cos(radian), y: orbit.cy + orbit.ry * Math.sin(radian) };
}

function isInside({ x, y }: { x: number; y: number }) {
  return x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom;
}

// 궤도 위쪽 반원에서 칸 안에 보이는 가장 긴 호(1° 단위)를 [시작, 끝] 각도로 돌려준다.
function visibleArc(tier: CompatibilityTier): [number, number] {
  let best: [number, number] = [-90, -90];
  let runStart: number | null = null;
  for (let degree = -180; degree <= 0; degree += 1) {
    if (isInside(pointAt(tier, degree))) {
      runStart ??= degree;
      if (degree - runStart > best[1] - best[0]) best = [runStart, degree];
    } else {
      runStart = null;
    }
  }
  return best;
}

// 같은 궤도 구슬 중심 사이 최소 거리(px) — 가장 큰 구슬 지름(귀인 30.6)에 닉네임 글자 여유를 더한 값.
const MIN_GAP_PX = 44;

// 닉네임으로 정하는 0~1 값(FNV-1a) — 같은 친구는 새로고침해도 같은 자리에 있다.
function seedOf(nickname: string): number {
  let hash = 0x811c9dc5;
  for (const char of nickname) {
    hash ^= char.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash / 0x1_0000_0000;
}

// n 칸으로 나눈 i 번째 칸 가운데에서 친구마다 조금 비껴 난 자리(0~1). 비껴 나는 폭을 (칸 너비 - 최소 간격)
// 안으로 묶어 이웃 칸과의 거리가 최소 간격 아래로 내려가지 않는다. 칸이 최소 간격보다 좁으면 가운데에 둔다.
function jittered(index: number, slots: number, minGap: number, seed: number): number {
  const width = 1 / slots;
  const room = Math.max(0, width - minGap);
  return (index + 0.5) * width + (seed - 0.5) * room;
}

// 친구(순위 순서)를 자기 등급 색 궤도 위에 놓는다 — 같은 궤도의 친구는 보이는 호를 나눈 칸 안에서 친구마다
// 고정된 랜덤으로 비껴 난 자리에 둔다(최소 간격 보장).
export function placeOrbs(friends: readonly Friend[]): PlacedOrb[] {
  const counts = new Map<CompatibilityTier, number>();
  for (const friend of friends) counts.set(friend.tier, (counts.get(friend.tier) ?? 0) + 1);

  // 등급(궤도)마다 출발을 엇갈려 여러 궤도의 구슬이 한꺼번에 숨지 않게 한다 — 다른 궤도끼리는 반지름이 달라 겹치지 않는다.
  const tiers = [...counts.keys()];
  const seen = new Map<CompatibilityTier, number>();
  return friends.map((friend) => {
    const index = seen.get(friend.tier) ?? 0;
    seen.set(friend.tier, index + 1);
    const count = counts.get(friend.tier) ?? 1;
    const [start, end] = visibleArc(friend.tier);
    const span = end - start;
    const orbit = tierOrbits[friend.tier];
    const r = (orbit.rx + orbit.ry) / 2;
    const seed = seedOf(friend.nickname);
    const arcPx = (span * Math.PI * r) / 180;

    // 멈춘 자리: 보이는 호를 count 칸으로 나눈다(양 끝에 반 칸씩 여유).
    const degree = start + span * jittered(index, count, MIN_GAP_PX / arcPx, seed);
    // 흐르는 출발: 한 주기에 보이는 호의 2배를 돌므로 그 둘레를 count 칸으로 나눈다.
    const phase = jittered(index, count, MIN_GAP_PX / (2 * arcPx), seed) - 0.5 / count;

    return {
      friend,
      ...pointAt(friend.tier, degree),
      // 벗 궤도(271.9 × 267.6)도 원으로 흐른다 — 선에서 벗어나는 폭은 2px 안이다.
      travel: {
        cx: orbit.cx,
        cy: orbit.cy,
        r,
        from: start,
        span,
        phase: (phase + tiers.indexOf(friend.tier) / tiers.length + 1) % 1,
      },
    };
  });
}
