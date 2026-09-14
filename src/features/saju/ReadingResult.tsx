import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

import type { Grade } from '@/ui/DestinyCard';
import type { Zodiac } from '@/ui/ZodiacCharacter';

import { fortuneOrder, type ReadingView } from './readingView';
import { FortuneSection } from './sections/FortuneSection';
import { LuckySection } from './sections/LuckySection';

// 운명 카드 앞면에 들어가는 값 — 뷰 모델에서 saju 가 만들고, 카드(뒤집기·인스타 공유)는 조립하는 쪽이 그린다.
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
  renderCard: (face: ReadingCardFace) => ReactNode; // 04 운명 카드(카드 뒤집기) + 인스타 스토리 공유하기
  ranking?: ReactNode; // 05 친구 궁합 순위
  teaser?: ReactNode; // 06 사전신청 티저
};

// SCR-04 사주 결과 — Figma 「UI 최종 - 개발용」 사주 결과 화면 Frame 93 (내 사주, 713:4021).
// 하위 라우트(사전신청 모달)는 맨 아래 <Outlet /> 에 뜬다.
export function ReadingResult({ view, renderCard, ranking, teaser }: Props) {
  const face: ReadingCardFace = {
    nickname: view.nickname,
    zodiac: view.zodiac,
    title: view.destiny.title,
    description: view.destiny.description,
    grades: fortuneOrder.map(({ key, label }) => ({ label, grade: view.fortunes[key].grade })),
  };

  return (
    <div className="flex flex-col gap-16 pt-8 pb-24">
      <h1 className="sr-only">{view.nickname}님의 사주 결과</h1>
      {renderCard(face)}
      <LuckySection item={view.luckyItem} place={view.luckyPlace} />
      <FortuneSection fortunes={view.fortunes} />
      {ranking}
      {teaser}
      <Outlet />
    </div>
  );
}
