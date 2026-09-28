import type { CSSProperties } from 'react';

import moon from '@/ui/assets/backgrounds/compatibility-moon.webp';
import orbit1 from '@/ui/assets/backgrounds/compatibility-orbit-1.webp';
import orbit2 from '@/ui/assets/backgrounds/compatibility-orbit-2.webp';
import orbit3 from '@/ui/assets/backgrounds/compatibility-orbit-3.webp';
import orbit4 from '@/ui/assets/backgrounds/compatibility-orbit-4.webp';

import { placeOrbs } from './orbLayout';
import { tierLooks, type Friend } from './tiers';

import './CompatibilityMap.css';

// mine = 내 궁합 지도(SCR-08), visitor = 공유 링크로 들어온 사람이 보는 링크 주인의 지도(SCR-06).
export type MapVariant = 'mine' | 'visitor';

type Props = {
  nickname: string;
  friends: readonly Friend[];
  variant?: MapVariant;
};

// 구슬은 등급 색 궤도 위에 놓는다 — 달에서 가까운 줄부터 귀인·찰떡·벗·스침(orbLayout). 친구 수 제한은 없다.

// 궤도 선·달 — 배경 SVG 에서 떼어 낸 레이어(05/T9). 원래 그리던 순서대로 둔다. (cx, cy) 는 패널 323px 기준 중심,
// r 은 에셋 한 변의 절반이다(에셋 중심 = 레이어 중심이라 제자리 회전이 된다).
// 에셋은 원래 SVG(그림자 블러·노이즈 필터)를 3배로 미리 구워 빈 가장자리를 중심 기준으로 잘라 낸 WebP 다. SVG 그대로면
// 폰이 필터를 3배 해상도로 그리느라 새로 연 페이지(카카오 로그인 복귀 등)에서 선·달이 수 초 비고 그동안 움직임도 멈췄다.
const orbits = [
  { src: orbit2, cx: 46.12, cy: 423.34, r: 231 },
  { src: orbit1, cx: 37.47, cy: 432.53, r: 177 },
  { src: orbit3, cx: 60.72, cy: 414.69, r: 289.67 },
  { src: orbit4, cx: 64.5, cy: 405.5, r: 343 },
] as const;
const moonLayer = { cx: 36.53, cy: 431.58, r: 177.67 } as const;

// 구슬이 이만큼 이상이면 궤도 선은 Figma 자리(0°)에 멈추고 구슬만 자기 궤도의 보이는 구간을 흐른다. 그보다 적으면
// (구슬 1개 이하) 구슬은 제자리에 있고 궤도 선만 돈다 — 둘이 함께 돌지 않고, 늘 둘 중 하나는 움직인다
// (2026-09-29 소유자 결정, PRD FR-8). 같은 궤도 친구는 주기를 똑같이 나눠 출발해 간격이 늘 같아 겹치지 않는다.
const SPIN_ORBS_FROM = 2;

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
  const placed = placeOrbs(friends);
  // 무엇이 움직이나 — 구슬 2개 이상이면 구슬만, 1개 이하면 궤도 선만.
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
            {placed.map(({ friend, x, y, travel }) => {
              const look = tierLooks[friend.tier];
              return (
                <li
                  key={friend.nickname}
                  style={cssVars({
                    '--x': x,
                    '--y': y,
                    '--d': look.orbSize,
                    '--cx': travel.cx,
                    '--cy': travel.cy,
                    '--r': travel.r,
                    '--from': travel.from,
                    '--span': travel.span,
                    '--loop': travel.loop,
                    '--duration': travel.duration,
                    '--phase': travel.phase,
                  })}
                >
                  <div data-compatibility-map-orb-arm="">
                    <div data-compatibility-map-orb="">
                      <img alt="" src={look.orb} />
                      <span>
                        {friend.nickname}
                        <span className="sr-only"> {look.label}</span>
                      </span>
                    </div>
                  </div>
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
