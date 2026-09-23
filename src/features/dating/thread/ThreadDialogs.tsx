import { useId } from 'react';

import threadElephant from '@/ui/assets/dating/thread-elephant.webp';

import { DatingDialog, DialogActions } from '../DatingDialog';

type ConfirmProps = {
  open: boolean;
  onClose: () => void;
  // '보내기' — 전송은 부르는 쪽이 한다(FR-29).
  onSend: () => void;
};

// SCR-19 운명의 실 보내기 확인 — Figma 운명의 실 보냈을 때 모달 1(112:3993).
// 보낸 뒤에는 열지 않은 정보를 더 볼 수 없음을 알리고 확인받는다(FR-29).
export function SendThreadDialog({ open, onClose, onSend }: ConfirmProps) {
  const titleId = useId();

  return (
    <DatingDialog labelledBy={titleId} onClose={onClose} open={open}>
      <img alt="" className="size-[124px]" draggable={false} src={threadElephant} />
      <div className="flex w-full flex-col items-center gap-20 text-center">
        <div className="flex flex-col gap-12">
          <h2 className="font-display text-display-20 text-apricot-900" id={titleId}>
            운명의 실을 보내시겠어요?
          </h2>
          <p className="text-ui-16 font-medium text-primary">
            <span className="text-status-error-foreground">
              실을 보낸 뒤에는 아직 열지 않은 정보를
              <br />더 이상 확인할 수 없어요.
            </span>
            <br />
            그래도 보내시겠어요?
          </p>
        </div>
        <DialogActions
          cancelLabel="취소"
          confirmLabel="보내기"
          onCancel={onClose}
          onConfirm={onSend}
        />
      </div>
    </DatingDialog>
  );
}

type SentProps = {
  open: boolean;
  onClose: () => void;
  onOpenRequests: () => void;
};

// SCR-19 운명의 실 보낸 뒤 — Figma 운명의 실 보냈을 때 모달 2(112:3810). '보러가기'는 요청함(SCR-20)으로.
export function ThreadSentDialog({ open, onClose, onOpenRequests }: SentProps) {
  const titleId = useId();

  return (
    <DatingDialog labelledBy={titleId} onClose={onClose} open={open}>
      <img alt="" className="size-[124px]" draggable={false} src={threadElephant} />
      <div className="flex w-full flex-col items-center gap-20 text-center">
        <div className="flex flex-col gap-12">
          <h2 className="font-display text-display-20 text-apricot-900" id={titleId}>
            성공적으로 운명의 실을 보냈어요!
          </h2>
          <p className="text-ui-16 font-medium text-primary">
            내가 보낸 사람은
            <br />
            요청함에서 확인하실 수 있어요.
          </p>
        </div>
        <DialogActions
          cancelLabel="확인"
          confirmLabel="보러가기"
          onCancel={onClose}
          onConfirm={onOpenRequests}
        />
      </div>
    </DatingDialog>
  );
}
