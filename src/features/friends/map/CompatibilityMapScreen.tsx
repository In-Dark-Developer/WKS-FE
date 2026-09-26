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
  // 버튼 자리 — mine 은 지도 바로 아래 '친구에게 공유하고 궁합 지도 넓히기'(Figma v1.0 57:2523, FR-14),
  // visitor 는 맨 아래 '내 사주 내용도 확인하기'.
  // friends 는 share feature·라우팅을 모르므로 app 이 채운다.
  share?: ReactNode;
  // 공유 버튼 아래 자리 — 비로그인 내 지도의 저장 유도 카드(FR-20). 로그인 판단은 app 이 한다.
  footer?: ReactNode;
  // 친구 줄을 눌렀을 때 — 궁합 이유 시트(FR-22)를 여는 이동은 app 이 정한다. 없으면 줄을 누를 수 없다.
  onSelectFriend?: (friend: Friend) => void;
  // visitor 는 주인의 사주 요약 없이 지도·등급별 인원·순위만 보인다(FR-15) — 이 화면은 요약을 받지도 않는다.
  variant?: MapVariant;
};

// SCR-08 궁합 지도(558:2625) · SCR-13 친구의 궁합 지도 = 링크 주인의 궁합 지도(720:3668).
export function CompatibilityMapScreen({
  nickname,
  friends,
  back,
  share,
  footer,
  variant = 'mine',
  onSelectFriend,
}: Props) {
  const selectable =
    onSelectFriend !== undefined && friends.some((f) => f.compatibilityId !== undefined);
  return (
    <div className={cn('flex flex-col gap-12 pb-24', !back && 'pt-4')}>
      {/* 뒤로가기 줄은 맨 위, 지도와 사이 24px(mb-12 + gap-12) — 결과 화면(720:3587, 48px)보다 좁다.
          지도는 카드가 바로 이어져 결과 화면만큼 띄우면 비어 보인다(소유자 확인 2026-09-17). */}
      {back ? <div className="mb-12">{back}</div> : null}
      <h1 className="sr-only">{nickname}님의 궁합 지도</h1>
      <CompatibilityMap friends={friends} nickname={nickname} variant={variant} />
      {/* mine 은 지도와 버튼 사이 12px(Figma v1.0 8:922 gap-12) — 로그인 여부와 무관하게 지도 아래(2026-09-26 확정). */}
      {share && variant === 'mine' ? share : null}
      <RelationStats friends={friends} />
      {/* Figma 30:5789 — 누를 수 있는 줄이 있을 때만 안내한다. */}
      {selectable ? (
        <p className="text-ui-12 text-secondary">친구 이름을 눌러 자세한 정보를 확인해보세요.</p>
      ) : null}
      <FriendRanking friends={friends} onSelect={onSelectFriend} />
      {/* visitor 는 내용과 버튼 사이 16px(713:3956) — gap-12 에 더한다. */}
      {share && variant === 'visitor' ? <div className="mt-4">{share}</div> : null}
      {/* 순위와 저장 유도 카드 사이 40px(Figma 24:5094 gap-40) — gap-12 에 더한다. */}
      {footer ? <div className="mt-[28px]">{footer}</div> : null}
    </div>
  );
}
