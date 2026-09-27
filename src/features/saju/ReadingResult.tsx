import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';
import type { Grade } from '@/ui/DestinyCard';
import type { Zodiac } from '@/ui/ZodiacCharacter';

import { fortuneOrder, type ReadingView } from './readingView';
import { ElementMatchSection } from './sections/ElementMatchSection';
import { ElementsSection } from './sections/ElementsSection';
import { FortuneSection } from './sections/FortuneSection';
import { LuckySection } from './sections/LuckySection';

import './ReadingResult.css';

// 운명 카드 앞면에 들어가는 값 — 뷰 모델에서 saju 가 만들고, 카드(뒤집기·저장)는 조립하는 쪽이 그린다.
export type ReadingCardFace = {
  nickname: string;
  zodiac: Zodiac;
  title: string;
  description: string;
  grades: readonly { label: string; grade: Grade }[];
};

type Props = {
  view: ReadingView;
  // 다른 feature 가 채우는 자리 — saju 는 share·friends·profile 을 import 하지 않고 app 이 조립한다.
  renderCard: (face: ReadingCardFace) => ReactNode; // 04 운명 카드(카드 뒤집기) + 카드 저장하기
  elementMatchAction?: ReactNode; // 잘 맞는 오행 아래 'OO 기운의 사람 만나보기' — 소개팅 입구. 이동은 app 이 정한다
  back?: ReactNode; // 맨 위 '뒤로가기' — 친구의 궁합 지도에서 들어온 내 사주(Figma 720:3587)만 쓴다. 이동은 app 이 정한다
};

// SCR-04 사주 결과 — Figma v1.0 사주 카드 화면(8:794): 카드 → 오행 → 잘 맞는 오행 → 행운 → 운세에서 끝난다.
// 친구 궁합 순위는 홈에 두지 않는다(2026-09-27 QA, 09/T12) — 궁합지도(/me/map)가 갖는다.
export function ReadingResult({ view, renderCard, elementMatchAction, back }: Props) {
  const face: ReadingCardFace = {
    nickname: view.nickname,
    zodiac: view.zodiac,
    title: view.destiny.title,
    description: view.destiny.description,
    grades: fortuneOrder.map(({ key, label }) => ({ label, grade: view.fortunes[key].grade })),
  };

  return (
    <div className={cn('flex flex-col gap-16 pb-24', !back && 'pt-8')} data-reading-result="">
      {/* 뒤로가기 줄은 맨 위, 카드와 사이 48px(720:3587) — gap-16 에 더한다. */}
      {back ? <div className="mb-32">{back}</div> : null}
      <h1 className="sr-only">{view.nickname}님의 사주 결과</h1>
      {renderCard(face)}
      <ElementsSection elements={view.elements} />
      {/* 옛 결과(약 905건)는 이유가 없어 영역을 그리지 않는다 — 다른 영역은 그대로다. */}
      {view.elementMatch ? (
        <ElementMatchSection action={elementMatchAction} match={view.elementMatch} />
      ) : null}
      <LuckySection item={view.luckyItem} place={view.luckyPlace} />
      <FortuneSection fortunes={view.fortunes} />
    </div>
  );
}
