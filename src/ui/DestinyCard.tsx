import type { CSSProperties } from 'react';

import aPlus from '@/ui/assets/grades/grade-a-plus.svg';
import a from '@/ui/assets/grades/grade-a.svg';
import bPlus from '@/ui/assets/grades/grade-b-plus.svg';
import b from '@/ui/assets/grades/grade-b.svg';
import s from '@/ui/assets/grades/grade-s.svg';
import ss from '@/ui/assets/grades/grade-ss.svg';
import { ZodiacCharacter, bodhisattvaNames, type Zodiac } from '@/ui/ZodiacCharacter';

import './DestinyCard.css';

// 백엔드 Grade 값 그대로 (docs/api/openapi.yaml) — 높은 순.
export type Grade = 'SS' | 'S' | 'A+' | 'A' | 'B+' | 'B';

type Props = {
  nickname: string;
  zodiac: Zodiac;
  title: string;
  description: string;
  // 위에서부터 한 줄씩 — 운명 카드는 결혼운·자녀운·연애운 세 줄이다.
  grades: readonly { label: string; grade: Grade }[];
  className?: string;
};

// 스탬프 SVG 의 높이(px, Figma 343px 카드 기준). 글자 폭이 달라 너비는 이미지 비율을 따른다.
const stamps: Record<Grade, { src: string; height: number }> = {
  SS: { src: ss, height: 41.29 },
  S: { src: s, height: 38.88 },
  'A+': { src: aPlus, height: 40.86 },
  A: { src: a, height: 39.14 },
  'B+': { src: bPlus, height: 40.9 },
  B: { src: b, height: 39.17 },
};

// 캐릭터마다 그림 크기가 달라 Figma 십이간지 카드(731:4740)의 자리를 그대로 옮긴다 — [left, top, width] (패널 323px 기준).
const characterBox: Record<Zodiac, readonly [number, number, number]> = {
  RAT: [-76, 167, 289],
  OX: [-20, 174, 253],
  TIGER: [-35, 153, 248],
  RABBIT: [-72, 167, 239],
  DRAGON: [-35, 153, 243],
  SNAKE: [-73, 103, 298],
  HORSE: [-57, 156, 239],
  GOAT: [-55, 183, 268],
  MONKEY: [-60, 172, 285],
  ROOSTER: [-77, 153, 310],
  DOG: [-84, 156, 290],
  PIG: [-114, 121, 380],
};

// Figma 좌표(px)를 CSS 변수로 넘겨 DestinyCard.css 가 카드 폭 비율로 계산한다.
// React 의 CSSProperties 타입은 커스텀 속성(--x)을 모르므로 단언한다.
function cssVars(vars: Record<string, number>): CSSProperties {
  return vars as CSSProperties;
}

// 스탬프 줄의 top (패널 기준) — Figma 결과 화면 운명 카드(713:4027).
const gradeRowTops = [194, 238, 286];

// Figma 「UI 최종 - 개발용」 결과 화면 운명 카드(713:4026). 카드 폭에 맞춰 통째로 비례 축소된다.
export function DestinyCard({ nickname, zodiac, title, description, grades, className }: Props) {
  const [left, top, width] = characterBox[zodiac];

  return (
    <section aria-label={`${nickname}님의 운명 카드`} className={className} data-destiny-card="">
      <div data-destiny-card-panel="">
        <ZodiacCharacter
          data-destiny-card-character=""
          style={cssVars({ '--x': left, '--y': top, '--w': width })}
          zodiac={zodiac}
        />
        <header data-destiny-card-header="">
          <h2>
            <span>{nickname}</span>
            님의 운명 카드
          </h2>
          <p>{bodhisattvaNames[zodiac]}님이 당신의 운명을 점지했어요.</p>
        </header>
        <div data-destiny-card-destiny="">
          <p>
            <span>당신의 운명은</span>
            <strong>{title}</strong>
          </p>
          <p>{description}</p>
        </div>
        <dl data-destiny-card-grades="">
          {grades.map(({ label, grade }, index) => (
            <div key={label} style={cssVars({ '--y': gradeRowTops[index] ?? 0 })}>
              <dt>{label}</dt>
              <dd>
                <img
                  alt={`${grade} 등급`}
                  src={stamps[grade].src}
                  style={cssVars({ '--h': stamps[grade].height })}
                />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
