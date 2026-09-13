import { useState } from 'react';

import cardBack from '@/ui/assets/cards/card-back.webp';
import rotateRight from '@/ui/assets/icons/rotate-right.svg';
import { DestinyCard, type Grade } from '@/ui/DestinyCard';
import { Icon } from '@/ui/Icon';
import type { Zodiac } from '@/ui/ZodiacCharacter';

import './ConnectionCard.css';

type Face = 'front' | 'back';

type Props = {
  nickname: string;
  zodiac: Zodiac;
  title: string;
  description: string;
  // 앞면 등급 줄 — 디자인은 결혼운·자녀운·연애운, PRD FR-5 는 연애운·결혼운·운명운(PRD Q3 미정)이라 이름째 받는다.
  grades: readonly { label: string; grade: Grade }[];
  initialFace?: Face;
};

// SCR-05 인연카드 — 앞면(Figma 731:4668·십이간지 카드 731:4740)·뒷면(731:4712)과 '카드 뒤집기'(FR-5).
export function ConnectionCard({ initialFace = 'front', ...front }: Props) {
  const [face, setFace] = useState<Face>(initialFace);
  const isBack = face === 'back';

  return (
    <div data-connection-card="" data-face={face}>
      <div data-connection-card-inner="">
        <div aria-hidden={isBack} inert={isBack}>
          <DestinyCard kind="connection" {...front} />
        </div>
        <div aria-hidden={!isBack} data-connection-card-back="" inert={!isBack}>
          <img alt="운명도 꿰어야 사랑이다" draggable={false} src={cardBack} />
        </div>
      </div>
      <button
        aria-pressed={isBack}
        className="flex items-center gap-8 rounded-999 border border-control bg-surface-default px-12 py-4 text-ui-14 font-medium whitespace-nowrap text-primary-500 drop-shadow-xs"
        data-connection-card-flip=""
        onClick={() => setFace(isBack ? 'front' : 'back')}
        type="button"
      >
        <Icon src={rotateRight} />
        카드 뒤집기
      </button>
    </div>
  );
}
