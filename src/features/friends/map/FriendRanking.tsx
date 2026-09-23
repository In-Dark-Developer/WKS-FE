import { useId, type ReactNode } from 'react';

import { cn } from '@/lib/cn';

import { tierLooks, type CompatibilityTier, type Friend } from './tiers';

type Props = {
  friends: readonly Friend[];
  // 결과 화면 하단 요약처럼 앞의 몇 줄만 보일 때.
  limit?: number;
  // '친구에게 공유' 같은 버튼 — 인연이 없으면 안내 아래, 있으면 목록 아래(Figma 796:3885)에 둔다.
  shareAction?: ReactNode;
  // 제목 줄 오른쪽 — 결과 화면의 '지도 보기 >'(Figma 798:3138).
  headerAction?: ReactNode;
  // 줄을 눌러 궁합 이유를 연다(FR-22, Figma 3.2) — 궁합 ID 가 있는 줄만 버튼이 된다.
  onSelect?: (friend: Friend) => void;
};

const badgeText: Record<CompatibilityTier, string> = {
  GUIIN: 'text-primary-900',
  CHALTTEOK: 'text-rose-900',
  BEOT: 'text-apricot-900',
  SEUCHIM: 'text-neutral-900',
};

// Figma RankingList(80:614) — 사주 카드 화면 인스턴스(796:3828) 모양: 제목 줄 패딩 16, 목록은 좌우 8 안쪽.
// friends 는 순위 순서다.
export function FriendRanking({ friends, limit, shareAction, headerAction, onSelect }: Props) {
  const rows = limit === undefined ? friends : friends.slice(0, limit);
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className="flex flex-col gap-8 rounded-16 border border-neutral bg-opacity-card-neutral-0-80 pb-8 backdrop-blur-md"
    >
      <div className="flex items-center justify-between gap-8 p-16">
        <h2 className="text-ui-18 font-semibold text-primary" id={titleId}>
          친구 궁합 순위
        </h2>
        {headerAction}
      </div>
      <div className="px-8">
        {rows.length === 0 ? (
          // Figma ContentState Empty · Inline (결과 화면 713:4078)
          <div
            className="flex flex-col gap-8 rounded-12 border border-neutral-0 bg-opacity-card-apricot-50-80 p-16"
            role="status"
          >
            <p className="text-ui-16 font-semibold text-primary">아직 인연이 없어요</p>
            <p className="text-ui-14 text-secondary">친구에게 공유하고 첫 인연을 이어보세요.</p>
            {shareAction}
          </div>
        ) : (
          <ol className="flex flex-col gap-8">
            {rows.map((friend, index) => (
              <li key={friend.nickname}>
                {onSelect && friend.compatibilityId !== undefined ? (
                  <button
                    aria-label={`${friend.nickname}님과의 궁합 이유 보기`}
                    className="w-full rounded-12 text-left"
                    onClick={() => onSelect(friend)}
                    type="button"
                  >
                    <RankingRow friend={friend} rank={index + 1} />
                  </button>
                ) : (
                  <RankingRow friend={friend} rank={index + 1} />
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
      {/* 목록이 있을 때 — Figma 796:3885 목록 아래 8, 좌우가 목록보다 조금 안쪽(285/343). */}
      {rows.length > 0 && shareAction ? <div className="px-20">{shareAction}</div> : null}
    </section>
  );
}

// 선택한 줄의 바탕 — Figma 30:5799 '궁합에 따른 색'. 등급 카드(RelationStat) 테두리 색과 같다.
const highlightTone: Record<CompatibilityTier, string> = {
  GUIIN: 'bg-primary-300',
  CHALTTEOK: 'bg-rose-300',
  BEOT: 'bg-apricot-300',
  SEUCHIM: 'bg-neutral-300',
};

// Figma RankingRow — 순위·닉네임·등급 배지·점수. highlighted 는 궁합 이유 시트 맨 위의 선택한 줄이다.
export function RankingRow({
  friend,
  rank,
  highlighted = false,
}: {
  friend: Friend;
  rank: number;
  highlighted?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-12 rounded-12 px-16 py-8',
        highlighted ? highlightTone[friend.tier] : 'bg-opacity-card-neutral-0-70',
      )}
    >
      <span className="w-24 font-display text-display-20 text-primary">{rank}</span>
      <span className="min-w-0 flex-1 truncate text-ui-14 font-medium text-primary">
        {friend.nickname}
      </span>
      <span className="relative flex size-40 shrink-0 items-center justify-center">
        <img
          alt=""
          className="absolute inset-0 size-full scale-135"
          src={tierLooks[friend.tier].badge}
        />
        <span
          className={`relative font-display text-ui-12 leading-none tracking-tighter ${badgeText[friend.tier]}`}
        >
          {tierLooks[friend.tier].label}
        </span>
      </span>
      <span className="w-40 text-center text-ui-16 font-semibold text-primary">
        {friend.score}
        <span className="sr-only">점</span>
      </span>
    </div>
  );
}
