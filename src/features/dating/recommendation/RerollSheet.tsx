import rerollElephant from '@/ui/assets/dating/reroll-elephant.webp';
import { BottomSheet } from '@/ui/BottomSheet';
import { Button } from '@/ui/Button';

import type { RerollView } from './cardsView';

type Props = {
  open: boolean;
  reroll: RerollView;
  onClose: () => void;
  onConfirm: () => void;
};

// 다른 인연 만나보기 확인 시트 — Figma 리롤 무료 o(112:3734) · 무료 x(112:3622).
// 바꾸면 지금 세 명을 다시 볼 수 없음을 알린다(FR-27). 잔액 부족 모습은 디자인에 없어 문구 한 줄로 막는다(FR-31).
export function RerollSheet({ open, reroll, onClose, onConfirm }: Props) {
  const isBlocked = reroll.kind === 'paid' && !reroll.canAfford;

  return (
    <BottomSheet
      className="items-center gap-20 pt-48"
      hasHandle
      label="새로운 인연을 만나볼까요?"
      onClose={onClose}
      open={open}
    >
      <div className="flex flex-col items-center gap-24 text-center">
        <img alt="" className="size-[124px]" draggable={false} src={rerollElephant} />
        <div className="flex flex-col gap-12">
          <h2 className="font-display text-display-24 text-rose-900">새로운 인연을 만나볼까요?</h2>
          <div className="flex flex-col gap-8">
            <p className="text-ui-16 font-medium text-primary">
              현재 추천된 3명의 인연을 모두 변경할 수 있어요.
              <br />
              변경 후에는 지금 인연들을 다시 볼 수 없어요.
            </p>
            <p className="text-ui-14 text-disabled">다음 무료 변경 시간은 오늘 자정입니다.</p>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-12">
        {isBlocked ? (
          <p
            className="text-center text-ui-14 font-medium text-status-error-foreground"
            role="alert"
          >
            운명의 실이 부족해요. 자정에 무료 점지권이 다시 생겨요.
          </p>
        ) : null}
        <Button disabled={isBlocked} onClick={onConfirm} size="m">
          {reroll.kind === 'free' ? '무료 점지권으로 변경하기' : `${reroll.cost}실로 지금 변경하기`}
        </Button>
        <Button onClick={onClose} size="m" variant="secondary">
          자정까지 기다릴게요
        </Button>
      </div>
    </BottomSheet>
  );
}
