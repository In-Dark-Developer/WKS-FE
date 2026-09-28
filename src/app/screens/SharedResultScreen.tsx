import type { ReactNode } from 'react';

import { CompatibilityMap, FriendRanking, type Friend } from '@/features/friends';
import { Button } from '@/ui/Button';

type Props = {
  ownerNickname: string;
  friends: readonly Friend[];
  mine: Friend;
  myRank: number;
  // 궁합 이유 세 문단 자리 — 로딩·오류·답은 라우트가 Await 로 채운다.
  reason: ReactNode;
  onViewAll: () => void;
  onViewMyReading: () => void;
};

// SCR-24 공유 궁합 결과 — Figma v1.0 `4.1.1` 15:1089 · `4.2.1` 30:6570 (09/T10, FR-6).
// 주인의 지도 → '나의 궁합 순위'(내 줄과 앞뒤 순위, 나는 등급 색 + '전체 보기 >') → 그 궁합의 이유 세 문단 → '내 사주 내용도 확인하기'.
// 간격은 Figma 대로 머리 20 · 지도 12 · 순위 16 · 이유 32 (15:1091·57:2762·15:1130).
export function SharedResultScreen({
  ownerNickname,
  friends,
  mine,
  myRank,
  reason,
  onViewAll,
  onViewMyReading,
}: Props) {
  // 내 줄이 가운데 오도록 바로 앞·뒤 순위와 함께 보인다(Figma 15:1301 '나의 점수(등수)가 가운데에 오도록').
  // 1등이면 뒤로 두 줄, 꼴찌면 앞으로 두 줄이 아니라 있는 만큼만이다.
  const start = Math.max(0, myRank - 2);
  const around = friends.slice(start, myRank + 1);

  return (
    <div className="flex flex-col pt-24 pb-24">
      {/* 화면 위 336px 을 Primary 500 → 투명으로 덮는다(Figma 58:2886) — 배경·별자리 리본 위, 내용 아래. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[336px] bg-linear-to-b from-primary-500 from-[2.5%] to-transparent to-[97.5%]"
      />
      {/* SectionHeader(15:1313) — 제목·설명 모두 흰 글자. */}
      <header className="flex flex-col gap-8 text-inverse">
        <h1 className="font-display text-display-28">운명도 꿰어야 사랑이다</h1>
        <p className="text-ui-14">
          {`사주에 기반한 ${mine.nickname}님과 ${ownerNickname}님의 궁합 분석이에요. 내용은 재미로만 참고해주세요.`}
        </p>
      </header>
      <div className="mt-20">
        <CompatibilityMap friends={friends} nickname={ownerNickname} variant="visitor" />
      </div>
      <div className="mt-12">
        <FriendRanking
          firstRank={start + 1}
          friends={around.length > 0 ? around : [mine]}
          highlightIndex={around.length > 0 ? myRank - 1 - start : 0}
          headerAction={
            <button
              className="text-ui-14 font-semibold text-primary-500"
              onClick={onViewAll}
              type="button"
            >
              전체 보기 &gt;
            </button>
          }
          title="나의 궁합 순위"
        />
      </div>
      <div className="mt-16">{reason}</div>
      <Button className="mt-32 w-full" onClick={onViewMyReading} variant="apricot">
        내 사주 내용도 확인하기
      </Button>
    </div>
  );
}
