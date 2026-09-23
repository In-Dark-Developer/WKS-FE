import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';
import { OverlayBackdrop, useOverlayBehavior } from '@/ui/Modal';

type Props = {
  open: boolean;
  onClose: () => void;
  // 제목 요소의 id — 제목 모양이 모달마다 달라 제목은 children 이 그린다. 제목이 없는 모달은 label 로 이름을 준다.
  labelledBy?: string;
  label?: string;
  children: ReactNode;
  className?: string;
};

// 소개팅 가운데 모달 — Figma 해금·운명의 실 모달(343 폭, 흰 판, 닫기 버튼 없음).
// 동작(포커스 가두기·ESC·배경 스크롤 잠금)은 ui/Modal 과 같고, 닫기는 모달 안 버튼이나 배경으로 한다.
export function DatingDialog({ open, onClose, labelledBy, label, children, className }: Props) {
  const { panelRef } = useOverlayBehavior(open, onClose);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-16">
      <OverlayBackdrop onClose={onClose} />
      <div
        aria-label={label}
        aria-labelledby={labelledBy}
        aria-modal="true"
        className={cn(
          'relative flex max-h-full w-full max-w-[343px] flex-col items-center gap-24 overflow-y-auto rounded-16 bg-surface-default px-16 py-32 shadow-sm',
          className,
        )}
        ref={panelRef}
        role="dialog"
        tabIndex={-1}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

type ActionsProps = {
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmDisabled?: boolean;
};

// 모달 아래 두 버튼 — 왼쪽 연한 회색, 오른쪽 짙은 회색(Figma 110:2496, 각 152 폭).
export function DialogActions({
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  confirmDisabled = false,
}: ActionsProps) {
  const buttonClass = 'flex-1 rounded-8 px-16 py-8 text-ui-12 font-medium';
  return (
    <div className="flex w-full gap-8">
      <button
        className={cn(buttonClass, 'bg-neutral-100 text-secondary')}
        onClick={onCancel}
        type="button"
      >
        {cancelLabel}
      </button>
      <button
        className={cn(
          buttonClass,
          'bg-neutral-900 text-inverse disabled:bg-neutral-600 disabled:text-neutral-400',
        )}
        disabled={confirmDisabled}
        onClick={onConfirm}
        type="button"
      >
        {confirmLabel}
      </button>
    </div>
  );
}
