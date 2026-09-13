import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';
import { Icon } from '@/ui/Icon';
import { OverlayBackdrop, useOverlayBehavior } from '@/ui/Modal';

export type ShareOption = {
  id: string;
  icon: string;
  label: ReactNode;
  onSelect: () => void;
};

type Props = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  options: readonly ShareOption[];
  className?: string;
};

// Figma 디자인시스템 ShareSheet — 화면 아래에서 올라오는 공유 옵션 목록(FR-4 친구에게 공유 ·
// FR-5 인스타 스토리 공유하기 등에서 조립해 쓴다). Modal 과 같은 포커스 트랩·ESC·스크롤 잠금을 쓴다.
export function ShareSheet({ open, onClose, title = '공유하기', options, className }: Props) {
  const { panelRef, titleId } = useOverlayBehavior(open, onClose);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <OverlayBackdrop onClose={onClose} />
      <div
        aria-labelledby={titleId}
        aria-modal="true"
        className={cn(
          'relative flex w-full max-w-[400px] flex-col gap-8 rounded-t-20 bg-surface-default p-20 pb-24',
          className,
        )}
        ref={panelRef}
        role="dialog"
        tabIndex={-1}
      >
        <h2 className="text-ui-18 font-semibold text-primary" id={titleId}>
          {title}
        </h2>
        <ul className="flex flex-col gap-4">
          {options.map((option) => (
            <li key={option.id}>
              <button
                className="flex w-full items-center gap-12 rounded-12 p-12 text-left hover:bg-surface-selected active:bg-surface-selected"
                onClick={() => {
                  option.onSelect();
                  onClose();
                }}
                type="button"
              >
                <Icon src={option.icon} />
                <span className="text-ui-16 text-primary">{option.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body,
  );
}
