import type { CSSProperties } from 'react';

import moon from '@/ui/assets/backgrounds/compatibility-moon.svg';
import orbit1 from '@/ui/assets/backgrounds/compatibility-orbit-1.svg';
import orbit2 from '@/ui/assets/backgrounds/compatibility-orbit-2.svg';
import orbit3 from '@/ui/assets/backgrounds/compatibility-orbit-3.svg';
import orbit4 from '@/ui/assets/backgrounds/compatibility-orbit-4.svg';

import { placeOrbs } from './orbLayout';
import { tierLooks, type Friend } from './tiers';

import './CompatibilityMap.css';

// mine = 내 궁합 지도(SCR-08), visitor = 공유 링크로 들어온 사람이 보는 링크 주인의 지도(SCR-06).
export type MapVariant = 'mine' | 'visitor';

type Props = { nickname: string; friends: readonly Friend[]; variant?: MapVariant };

// 구슬은 등급 색 궤도 위에 놓는다 — 달에서 가까운 줄부터 귀인·찰떡·벗·스침(orbLayout, 2026-09-15 소유자 결정).
const MAX_ORBS = 5;

// 궤도 선·달 — 배경 SVG 에서 떼어 낸 레이어(05/T9). 원래 그리던 순서대로 둔다. (cx, cy) 는 패널 323px 기준 중심,
// r 은 에셋 한 변의 절반이다(에셋 중심 = 레이어 중심이라 제자리 회전이 된다).
const orbits = [
  { src: orbit2, cx: 46.12, cy: 423.34, r: 329 },
  { src: orbit1, cx: 37.47, cy: 432.53, r: 246 },
  { src: orbit3, cx: 60.72, cy: 414.69, r: 415 },
  { src: orbit4, cx: 64.5, cy: 405.5, r: 496 },
] as const;
const moonLayer = { cx: 36.53, cy: 431.58, r: 244 } as const;

// 친구가 이만큼 이상이면 궤도 선과 구슬이 달 중심으로 한 덩어리로 돈다 — 같은 중심·같은 속도라 구슬 간격이
// 그대로여서 겹치지 않는다. 그보다 적으면 궤도 선만 저마다 제자리에서 돈다 (PRD FR-8).
const SPIN_ORBS_FROM = 3;

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
  const placed = placeOrbs(friends.slice(0, MAX_ORBS));
  const motion = friends.length >= SPIN_ORBS_FROM ? 'orbs' : 'orbits';

  return (
    <section
      aria-label={`${nickname}님의 궁합 지도`}
      data-compatibility-map=""
      data-motion={motion}
    >
      <div data-compatibility-map-panel="">
        <div data-compatibility-map-sky="">
          {orbits.map((orbit) => (
            <img
              alt=""
              data-compatibility-map-orbit=""
              key={orbit.src}
              src={orbit.src}
              style={cssVars({ '--cx': orbit.cx, '--cy': orbit.cy, '--r': orbit.r })}
            />
          ))}
          <img
            alt=""
            data-compatibility-map-moon=""
            src={moon}
            style={cssVars({ '--cx': moonLayer.cx, '--cy': moonLayer.cy, '--r': moonLayer.r })}
          />
          <ul data-compatibility-map-orbs="">
            {placed.map(({ friend, x, y }) => {
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
        <header data-compatibility-map-header="">
          <h2>{nickname}님의 궁합 지도</h2>
          <p>{subtitle(nickname, friends.length, variant)}</p>
        </header>
      </div>
    </section>
  );
}
