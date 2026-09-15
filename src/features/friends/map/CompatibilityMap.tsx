import type { CSSProperties } from 'react';

import { tierLooks, type Friend } from './tiers';

import './CompatibilityMap.css';

// mine = 내 궁합 지도(SCR-08), visitor = 공유 링크로 들어온 사람이 보는 링크 주인의 지도(SCR-06).
export type MapVariant = 'mine' | 'visitor';

type Props = { nickname: string; friends: readonly Friend[]; variant?: MapVariant };

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

// 부제 — 방문자 지도는 친구 수와 상관없이 같은 문구다(Figma 713:3956).
function subtitle(nickname: string, friendCount: number, variant: MapVariant) {
  if (variant === 'visitor') return `${nickname}님과의 궁합 지도예요.`;
  return friendCount > 0
    ? `내 친구 ${friendCount}명과의 인연을 그린 지도에요`
    : '아직 지도에 그린 인연이 없어요';
}

// 궁합 지도의 지도 카드 — Figma 「UI 최종 - 개발용」 지도 최종 v2(558:2628) · 궁합 지도 확인(713:3956). friends 는 순위 순서다.
export function CompatibilityMap({ nickname, friends, variant = 'mine' }: Props) {
  const placed = friends.slice(0, orbSlots.length);

  return (
    <section aria-label={`${nickname}님의 궁합 지도`} data-compatibility-map="">
      <div data-compatibility-map-panel="">
        <header data-compatibility-map-header="">
          <h2>{nickname}님의 궁합 지도</h2>
          <p>{subtitle(nickname, friends.length, variant)}</p>
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
