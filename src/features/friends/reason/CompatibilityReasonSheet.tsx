import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';
import { Button } from '@/ui/Button';
import { BottomSheet } from '@/ui/BottomSheet';

import { RankingRow } from '../map/FriendRanking';
import { tierLooks, type CompatibilityTier, type Friend } from '../map/tiers';

export type ReasonView = { why: string; together: string; conflict: string };

// 첫 열람은 백엔드가 이유를 만드느라 수 초(최대 30초) 걸린다 — 그 동안 'loading', 실패하면 'error'(FR-22).
export type ReasonState =
  { status: 'loading' } | { status: 'error' } | ({ status: 'ready' } & ReasonView);

type SheetProps = {
  friend: Friend;
  rank: number;
  onClose: () => void;
  // 답 영역 — 로딩에서 답으로 바뀌어도 시트는 그대로 두고 이 자리만 바꾼다(ReasonAnswers).
  children: ReactNode;
};

// Figma 3.2 친구 궁합 리스트 이유(30:5749) — 궁합 지도 위에 올라오는 시트. 맨 위에 고른 친구 줄(등급 색),
// 그 아래 세 질문의 답. 두 사람이 같은 내용을 본다.
export function CompatibilityReasonSheet({ friend, rank, onClose, children }: SheetProps) {
  return (
    <BottomSheet
      className="gap-20 bg-surface-muted"
      hasHandle
      label={`${friend.nickname}님과의 궁합 이유`}
      onClose={onClose}
      open
    >
      <RankingRow friend={friend} highlighted rank={rank} />
      {children}
    </BottomSheet>
  );
}

type AnswersProps = {
  tier: CompatibilityTier;
  state: ReasonState;
  onRetry?: () => void;
  // 본문 글자 — 시트(Figma 3.2 30:5749)는 UI/14, 공유 궁합 결과 페이지(4.1.1 57:2762)는 UI/16.
  bodySize?: 'sheet' | 'page';
};

// 세 질문의 답 — 첫 질문은 그 친구의 등급 이름을 넣는다('왜 나에게 귀인일까요?').
export function ReasonAnswers({ tier, state, onRetry, bodySize = 'sheet' }: AnswersProps) {
  if (state.status === 'error') {
    return (
      <div className="flex flex-col items-center gap-12 py-24 text-center" role="alert">
        <p className="text-ui-16 font-semibold text-primary">
          지금은 궁합 이유를 풀어내지 못했어요
        </p>
        <p className="text-ui-14 text-secondary">잠시 뒤 다시 시도해 주세요.</p>
        {onRetry ? (
          <Button onClick={onRetry} size="m" variant="secondary">
            다시 시도하기
          </Button>
        ) : null}
      </div>
    );
  }

  const questions = [
    { key: 'why', title: `왜 나에게 ${tierLooks[tier].label}일까요?` },
    { key: 'together', title: '둘이 만나게 된다면?' },
    { key: 'conflict', title: '둘이 싸우게 된다면?' },
  ] as const;

  return (
    <div aria-busy={state.status === 'loading'} className="flex flex-col gap-16">
      {state.status === 'loading' ? (
        <p className="text-center text-ui-14 text-secondary" role="status">
          보살이 두 사람의 인연을 풀어보는 중이에요…
        </p>
      ) : null}
      {questions.map(({ key, title }) => (
        // Card/Fortune(8:6) — 흰 판 80% · Border/Default · 그림자 0 2 2 15% · 블러.
        <section
          className="flex flex-col gap-12 rounded-16 border border-default bg-opacity-card-neutral-0-80 p-16 shadow-sm backdrop-blur-sm"
          key={key}
        >
          <h3 className="text-ui-18 font-semibold text-primary">{title}</h3>
          {state.status === 'ready' ? (
            <p
              className={cn(
                'break-keep text-secondary',
                bodySize === 'page' ? 'text-ui-16' : 'text-ui-14',
              )}
            >
              {state[key]}
            </p>
          ) : (
            <span aria-hidden="true" className="flex flex-col gap-8">
              <span className="h-12 w-full animate-pulse rounded-999 bg-neutral-200" />
              <span className="h-12 w-3/4 animate-pulse rounded-999 bg-neutral-200" />
            </span>
          )}
        </section>
      ))}
    </div>
  );
}
