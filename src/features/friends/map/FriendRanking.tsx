import { useId, type ReactNode } from 'react';

import { tierLooks, type CompatibilityTier, type Friend } from './tiers';

type Props = {
  friends: readonly Friend[];
  // 결과 화면 하단 요약처럼 앞의 몇 줄만 보일 때.
  limit?: number;
  // 인연이 없을 때 안내 아래 둘 버튼 — 예: '친구에게 공유'.
  emptyAction?: ReactNode;
};

const badgeText: Record<CompatibilityTier, string> = {
  GUIIN: 'text-primary-900',
  CHALTTEOK: 'text-rose-900',
  BEOT: 'text-apricot-900',
  SEUCHIM: 'text-neutral-900',
};

// Figma RankingList(80:614) — 지도 최종 v2(558:2679) 모양. friends 는 순위 순서다.
export function FriendRanking({ friends, limit, emptyAction }: Props) {
  const rows = limit === undefined ? friends : friends.slice(0, limit);
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className="flex flex-col gap-8 rounded-16 border border-neutral bg-opacity-card-neutral-0-50 pr-12 pb-8 pl-8"
    >
      <h2 className="px-8 pt-16 pb-8 text-ui-18 font-semibold text-primary" id={titleId}>
        친구 궁합 순위
      </h2>
      {rows.length === 0 ? (
        // Figma ContentState Empty · Inline (결과 화면 713:4078)
        <div
          className="flex flex-col gap-8 rounded-12 border border-neutral-0 bg-opacity-card-apricot-50-80 p-16"
          role="status"
        >
          <p className="text-ui-16 font-semibold text-primary">아직 인연이 없어요</p>
          <p className="text-ui-14 text-secondary">친구에게 공유하고 첫 인연을 이어보세요.</p>
          {emptyAction}
        </div>
      ) : (
        <ol className="flex flex-col gap-8">
          {rows.map((friend, index) => (
            <li
              className="flex items-center gap-12 rounded-12 bg-opacity-card-neutral-0-70 px-16 py-8"
              key={friend.nickname}
            >
              <span className="w-24 font-display text-display-20 text-primary">{index + 1}</span>
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
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
