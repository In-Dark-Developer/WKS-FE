import { useRef, useState, type UIEvent } from 'react';

import { cn } from '@/lib/cn';
import emptyElephant from '@/ui/assets/dating/empty-elephant.webp';
import rotateRight from '@/ui/assets/icons/rotate-right.svg';
import { Button } from '@/ui/Button';
import { Icon } from '@/ui/Icon';
import type { ProfileCardFace } from '@/ui/ProfileCard';

import { DatingBackdrop } from '../DatingBackdrop';
import { CandidateCard } from './CandidateCard';
import type { DatingCardsView } from './cardsView';
import { DatingHeader } from './DatingHeader';
import { RerollSheet } from './RerollSheet';

type Props = {
  view: DatingCardsView;
  // 지금 보이는 카드의 상대에게 — 확인 모달·전송은 Phase 11 이 한다.
  onSendThread: (candidateId: string) => void;
  onOpenUnlock: (candidateId: string) => void;
  // 리롤 확인 시트에서 변경을 고른 뒤. 차감·새 추천은 부르는 쪽이 한다.
  onReroll: () => void;
  onOpenRequests: () => void;
  // 미리보기용 시작 상태.
  initialCardFace?: ProfileCardFace;
  initialRerollOpen?: boolean;
};

// SCR-17 오늘의 인연 Top 3 — Figma 카드 앞면(91:1641) · 뒷면(103:2533) · 인연x(134:2320) · 리롤 시트.
export function DatingCards({
  view,
  onSendThread,
  onOpenUnlock,
  onReroll,
  onOpenRequests,
  initialCardFace,
  initialRerollOpen = false,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isRerollOpen, setRerollOpen] = useState(initialRerollOpen);
  const trackRef = useRef<HTMLUListElement>(null);
  const active = view.candidates[activeIndex];

  function handleScroll(event: UIEvent<HTMLUListElement>) {
    const { scrollLeft, clientWidth } = event.currentTarget;
    if (clientWidth > 0) setActiveIndex(Math.round(scrollLeft / clientWidth));
  }

  function showCandidate(index: number) {
    setActiveIndex(index);
    const track = trackRef.current;
    track?.scrollTo?.({ left: index * track.clientWidth, behavior: 'smooth' });
  }

  return (
    <div className="flex flex-col gap-20">
      <DatingBackdrop />
      <DatingHeader balance={view.balance} onOpenRequests={onOpenRequests} />

      <section className="flex flex-col gap-32">
        <header className="flex flex-col gap-4">
          <h1 className="font-display text-display-28 text-rose-500">나와 잘 맞는 인연 TOP 3</h1>
          <p className="text-ui-14 font-medium text-secondary">
            사주 궁합을 바탕으로 잘 맞는 세 사람을 소개해드려요.
            <br />
            다른 사람과 매칭된 상대는 언제든지 바뀔 수 있어요.
          </p>
        </header>

        <div className="flex flex-col items-center gap-12">
          {view.candidates.length === 0 ? (
            <EmptyCard />
          ) : (
            <ul
              aria-label="오늘의 인연"
              className="flex w-full snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto"
              onScroll={handleScroll}
              ref={trackRef}
            >
              {view.candidates.map((candidate) => (
                <li className="w-full shrink-0 snap-center" key={candidate.id}>
                  <CandidateCard
                    candidate={candidate}
                    initialFace={initialCardFace}
                    onOpenUnlock={candidate.isThreadSent ? undefined : onOpenUnlock}
                  />
                </li>
              ))}
            </ul>
          )}
          <Indicator
            activeIndex={activeIndex}
            ids={
              view.candidates.length > 0
                ? view.candidates.map((candidate) => candidate.id)
                : emptyIndicatorIds
            }
            isInteractive={view.candidates.length > 0}
            onSelect={showCandidate}
          />
        </div>

        <div className="flex flex-col gap-12">
          <Button
            disabled={!active || active.isThreadSent === true}
            onClick={() => {
              if (active) onSendThread(active.id);
            }}
            size="m"
          >
            {active?.isThreadSent ? '운명의 실을 보냈어요' : '운명의 실 보내기'}
          </Button>
          <div className="flex flex-col items-center gap-8">
            <Button
              className="w-full"
              leadingIcon={<Icon className="size-[18px]" src={rotateRight} />}
              onClick={() => setRerollOpen(true)}
              size="m"
              variant="ghost"
            >
              다른 인연 만나보기
            </Button>
            <p className="text-ui-12 text-muted">
              {view.reroll.kind === 'free'
                ? '오늘 1회 무료 점지권이 생겼어요.'
                : '다음 무료 점지는 오늘 자정이에요.'}
            </p>
          </div>
        </div>
      </section>

      <RerollSheet
        onClose={() => setRerollOpen(false)}
        onConfirm={() => {
          setRerollOpen(false);
          onReroll();
        }}
        open={isRerollOpen}
        reroll={view.reroll}
      />
    </div>
  );
}

// 인연x — 추천할 상대가 없을 때(Figma 134:2248).
function EmptyCard() {
  return (
    <div className="relative flex h-[433px] w-full items-center justify-center overflow-hidden rounded-12 border border-neutral-0 bg-neutral-800">
      <img
        alt=""
        className="absolute size-[178px] opacity-20"
        draggable={false}
        src={emptyElephant}
      />
      <p className="relative text-ui-14 font-medium text-neutral-100">
        운명의 인연을 기다리고 있어요
      </p>
    </div>
  );
}

const emptyIndicatorIds = ['empty-1', 'empty-2', 'empty-3'] as const;

type IndicatorProps = {
  ids: readonly string[];
  activeIndex: number;
  isInteractive: boolean;
  onSelect: (index: number) => void;
};

// 카드 위치 점(Figma 112:3455 '인디케이터'). 빈 상태에서는 장식으로만 보인다.
function Indicator({ ids, activeIndex, isInteractive, onSelect }: IndicatorProps) {
  const dotClass = (index: number) =>
    cn('size-[10px] rounded-999', index === activeIndex ? 'bg-neutral-700' : 'bg-neutral-0');

  return (
    <div className="flex gap-8 rounded-999 bg-opacity-card-neutral-0-50 px-12 py-4">
      {ids.map((id, index) =>
        isInteractive ? (
          <button
            aria-current={index === activeIndex || undefined}
            aria-label={`${index + 1}번째 인연 보기`}
            className={dotClass(index)}
            key={id}
            onClick={() => onSelect(index)}
            type="button"
          />
        ) : (
          <span aria-hidden="true" className={dotClass(index)} key={id} />
        ),
      )}
    </div>
  );
}
