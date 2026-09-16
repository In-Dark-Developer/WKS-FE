import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

import { CompatibilityMap, type MapVariant } from './CompatibilityMap';
import { FriendRanking } from './FriendRanking';
import { RelationStats } from './RelationStats';
import type { Friend } from './tiers';

type Props = {
  // 지도 주인의 닉네임 — visitor 면 공유 링크 주인이다.
  nickname: string;
  // 맨 위 '뒤로가기' 자리 — 내 지도(`/me/map`)가 내 사주로 돌아갈 때 쓴다(Figma 720:3587 과 같은 줄 모양).
  // 이동은 app 이 정한다. visitor 지도는 쓰지 않는다(뒤로가기 없음 — 720:3668).
  back?: ReactNode;
  // 순위 순서(점수 높은 순) — 정렬·조회는 연동(05/T3 toReadingView)이 한다.
  friends: readonly Friend[];
  // 맨 아래 버튼 자리 — mine 은 '친구에게 공유하고 궁합 지도 넓히기', visitor 는 '내 사주 내용도 확인하기'.
  // friends 는 share feature·라우팅을 모르므로 app 이 채운다.
  share?: ReactNode;
  // visitor 는 주인의 사주 요약 없이 지도·등급별 인원·순위만 보인다(FR-15) — 이 화면은 요약을 받지도 않는다.
  variant?: MapVariant;
};

// SCR-08 궁합 지도(558:2625) · SCR-13 친구의 궁합 지도 = 링크 주인의 궁합 지도(720:3668).
export function CompatibilityMapScreen({
  nickname,
  friends,
  back,
  share,
  variant = 'mine',
}: Props) {
  return (
    <div className={cn('flex flex-col gap-12 pb-24', !back && 'pt-4')}>
      {/* 뒤로가기 줄은 맨 위, 지도와 사이 24px(mb-12 + gap-12) — 결과 화면(720:3587, 48px)보다 좁다.
          지도는 카드가 바로 이어져 결과 화면만큼 띄우면 비어 보인다(소유자 확인 2026-09-17). */}
      {back ? <div className="mb-12">{back}</div> : null}
      <h1 className="sr-only">{nickname}님의 궁합 지도</h1>
      <CompatibilityMap friends={friends} nickname={nickname} variant={variant} />
      <RelationStats friends={friends} />
      <FriendRanking friends={friends} />
      {/* 내용과 버튼 사이 — mine 36px(558:2571) · visitor 16px(713:3956). gap-12 에 더한다. */}
      {share ? <div className={variant === 'visitor' ? 'mt-4' : 'mt-24'}>{share}</div> : null}
    </div>
  );
}
