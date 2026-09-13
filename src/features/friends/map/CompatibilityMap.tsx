import type { CSSProperties } from 'react';

import { tierLooks, type Friend } from './tiers';

import './CompatibilityMap.css';

type Props = { nickname: string; friends: readonly Friend[] };

// 구슬 자리 — 배치 규칙이 미정이라(PRD Q11) Figma 지도(558:2625)의 다섯 자리를 순위대로 채운다. 원 중심 좌표(패널 323px 기준).
const orbSlots: readonly (readonly [number, number])[] = [
  [55.85, 284.33],
  [113.54, 223.77],
  [219.54, 302.77],
  [89.85, 147.61],
  [268.01, 150.16],
];

// React 의 CSSProperties 타입은 커스텀 속성(--x)을 모르므로 단언한다.
function cssVars(vars: Record<string, number>): CSSProperties {
  return vars as CSSProperties;
}

// SCR-08 궁합 지도의 지도 카드 — Figma 「UI 최종 - 개발용」 지도 최종 v2(558:2628). friends 는 순위 순서다.
export function CompatibilityMap({ nickname, friends }: Props) {
  const placed = friends.slice(0, orbSlots.length);

  return (
    <section aria-label={`${nickname}님의 궁합 지도`} data-compatibility-map="">
      <div data-compatibility-map-panel="">
        <header data-compatibility-map-header="">
          <h2>{nickname}님의 궁합 지도</h2>
          <p>
            {friends.length > 0
              ? `내 친구 ${friends.length}명과의 인연을 그린 지도에요`
              : '아직 지도에 그린 인연이 없어요'}
          </p>
        </header>
        <ul data-compatibility-map-orbs="">
          {placed.map((friend, index) => {
            const [x, y] = orbSlots[index] ?? [0, 0];
            const look = tierLooks[friend.tier];
            return (
              <li
                key={friend.nickname}
                style={cssVars({ '--x': x, '--y': y, '--d': look.orbSize })}
              >
                <img alt="" src={look.orb} />
                <span>
                  {friend.nickname}
                  <span className="sr-only"> {look.label}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
