import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

import { DestinyCard } from '@/ui/DestinyCard';

import { fortuneOrder, type ReadingView } from './readingView';
import { FortuneSection } from './sections/FortuneSection';
import { LuckySection } from './sections/LuckySection';

type Props = {
  view: ReadingView;
  // 다른 Phase 가 채우는 자리 — saju 는 share·friends·profile 을 import 하지 않고 03/T7 이 조립한다.
  share?: ReactNode; // 04 인스타 스토리 공유하기
  ranking?: ReactNode; // 05 친구 궁합 순위
  teaser?: ReactNode; // 06 사전신청 티저
};

// SCR-04 사주 결과 — Figma 「UI 최종 - 개발용」 사주 결과 화면 Frame 93 (내 사주, 713:4021).
// 하위 라우트(사전신청 모달)는 맨 아래 <Outlet /> 에 뜬다. 인연카드(reading/:id/card)는 전체 화면이라 형제 라우트다.
export function ReadingResult({ view, share, ranking, teaser }: Props) {
  const grades = fortuneOrder.map(({ key, label }) => ({ label, grade: view.fortunes[key].grade }));

  return (
    <div className="flex flex-col gap-16 pt-8 pb-24">
      <h1 className="sr-only">{view.nickname}님의 사주 결과</h1>
      <DestinyCard
        description={view.destiny.description}
        grades={grades}
        nickname={view.nickname}
        title={view.destiny.title}
        zodiac={view.zodiac}
      />
      {share}
      <LuckySection item={view.luckyItem} place={view.luckyPlace} />
      <FortuneSection fortunes={view.fortunes} />
      {ranking}
      {teaser}
      <Outlet />
    </div>
  );
}
