import { useId, useState } from 'react';

import { cn } from '@/lib/cn';
import { ThreadCount } from '@/ui/ThreadCount';

import { DatingDialog, DialogActions } from '../DatingDialog';
import { unlockItemLooks, type UnlockItem, type UnlockOptionView } from './unlockView';

type Props = {
  open: boolean;
  balance: number;
  options: readonly UnlockOptionView[];
  onClose: () => void;
  // 고른 항목들 — 차감과 해금은 부르는 쪽이 한다(FR-28).
  onConfirm: (items: readonly UnlockItem[]) => void;
  // 미리보기용 — 고른 채로 시작한다.
  initialSelected?: readonly UnlockItem[];
};

// SCR-18 정보 해금 모달 — Figma 모달(106:2200) · hover·selected(106:2323) · 이미 연 항목 비활성(112:3302).
// 여러 항목을 함께 고를 수 있고, 버튼에 고른 비용의 합을 적는다.
export function UnlockDialog({
  open,
  balance,
  options,
  onClose,
  onConfirm,
  initialSelected = [],
}: Props) {
  const titleId = useId();
  const [selected, setSelected] = useState<readonly UnlockItem[]>(initialSelected);
  const total = options
    .filter((option) => selected.includes(option.item))
    .reduce((sum, option) => sum + option.cost, 0);
  const isShort = total > balance;

  function toggle(item: UnlockItem) {
    setSelected((current) =>
      current.includes(item) ? current.filter((each) => each !== item) : [...current, item],
    );
  }

  function close() {
    setSelected([]);
    onClose();
  }

  return (
    <DatingDialog labelledBy={titleId} onClose={close} open={open}>
      <div className="flex w-full flex-col gap-8">
        <div className="flex items-start justify-between gap-24">
          <h2 className="font-display text-display-20 text-rose-900" id={titleId}>
            운명의 실로
            <br />
            정보를 열어보세요
          </h2>
          <ThreadCount count={balance} />
        </div>
        <p className="text-ui-12 text-secondary">
          운명의 실을 사용해 상대를 조금 더 알아볼 수 있어요.
        </p>
      </div>

      <div className="flex w-full flex-col gap-20">
        <ul className="grid grid-cols-2 gap-8">
          {options.map((option) => (
            <li key={option.item}>
              <UnlockOption
                isSelected={selected.includes(option.item)}
                onToggle={() => toggle(option.item)}
                option={option}
              />
            </li>
          ))}
        </ul>
        {isShort ? (
          <p
            className="text-center text-ui-14 font-medium text-status-error-foreground"
            role="alert"
          >
            운명의 실이 부족해요.
          </p>
        ) : null}
        <DialogActions
          cancelLabel="취소"
          confirmDisabled={total === 0 || isShort}
          confirmLabel={total > 0 ? `${total}개 사용하기` : '사용하기'}
          onCancel={close}
          onConfirm={() => {
            onConfirm(selected);
            setSelected([]);
          }}
        />
      </div>
    </DatingDialog>
  );
}

type OptionProps = {
  option: UnlockOptionView;
  isSelected: boolean;
  onToggle: () => void;
};

// 항목 한 칸 — 기본 · hover 와 선택(같은 모습, Figma 112:2990) · 이미 연 항목(비활성).
function UnlockOption({ option, isSelected, onToggle }: OptionProps) {
  const { label, image } = unlockItemLooks[option.item];

  return (
    <button
      aria-pressed={option.isUnlocked ? undefined : isSelected}
      className={cn(
        'flex h-[101px] w-full items-center justify-center gap-8 rounded-8 border px-12 py-8',
        option.isUnlocked
          ? 'cursor-not-allowed border-neutral-100 bg-neutral-50 text-disabled'
          : isSelected
            ? 'border-rose-500 bg-rose-100 text-rose-900'
            : 'border-rose-100 bg-opacity-card-rose-50-50 text-primary hover:border-rose-500 hover:bg-rose-100 hover:text-rose-900',
      )}
      disabled={option.isUnlocked}
      onClick={onToggle}
      type="button"
    >
      <img
        alt=""
        className={cn('size-[67px]', option.isUnlocked && 'opacity-60 grayscale')}
        draggable={false}
        src={image}
      />
      <span className="flex flex-col items-end gap-4 whitespace-nowrap">
        <span className="text-ui-16 font-medium">{label}</span>
        <span className="text-ui-12">{option.cost}개로 열기</span>
      </span>
    </button>
  );
}
