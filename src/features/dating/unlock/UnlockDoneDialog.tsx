import { useId } from 'react';

import { cn } from '@/lib/cn';
import { ThreadCount } from '@/ui/ThreadCount';

import { DatingDialog } from '../DatingDialog';
import { unlockItemLooks, type UnlockItem } from './unlockView';

type Props = {
  open: boolean;
  // 차감한 뒤의 잔액 — 백엔드가 준 값.
  balance: number;
  // 방금 연 항목들, 보일 순서대로.
  items: readonly UnlockItem[];
  onClose: () => void;
};

// SCR-18 구매 완료 — Figma 모달 - 구매 완료(112:3017) · selected 2·3·4개(112:3113 · 112:3099 · 112:3045).
// 그림은 한 줄로 늘어놓고, 네 개일 때만 2×2 로 놓는다(Figma 주석).
export function UnlockDoneDialog({ open, balance, items, onClose }: Props) {
  const titleId = useId();

  return (
    <DatingDialog labelledBy={titleId} onClose={onClose} open={open}>
      <div className="flex flex-col items-center gap-12 text-center">
        <h2 className="font-display text-display-20 text-apricot-900" id={titleId}>
          운명의 실을 이용해
          <br />
          정보를 열었어요!
        </h2>
        <ThreadCount count={balance} />
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className={cn('gap-4', items.length === 4 ? 'grid grid-cols-2' : 'flex')}>
          {items.map((item) => (
            <img
              alt=""
              className="size-[91px]"
              draggable={false}
              key={item}
              src={unlockItemLooks[item].image}
            />
          ))}
        </div>
        <p className="text-center text-ui-14 font-medium text-primary">
          <span className="mr-8 text-muted">확인 가능한 정보</span>
          {items.map((item) => unlockItemLooks[item].label).join(', ')}
        </p>
      </div>

      <button
        className="w-[152px] rounded-8 bg-neutral-900 px-16 py-8 text-ui-12 font-medium text-inverse"
        onClick={onClose}
        type="button"
      >
        확인
      </button>
    </DatingDialog>
  );
}
