import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';
import { OverlayBackdrop, useOverlayBehavior } from '@/ui/Modal';

type Props = {
  open: boolean;
  onClose: () => void;
  // 시트 제목 — 화면마다 제목 모양이 달라 내용은 children 이 그리고, 스크린 리더용 이름만 받는다.
  label: string;
  // 위쪽 손잡이(24×4) — 리롤 시트(Figma 112:3773)에는 있고 로그인 시트(132:3429)에는 없다.
  hasHandle?: boolean;
  className?: string;
  children: ReactNode;
};

// 화면 아래에서 올라오는 시트 — Modal 과 같은 포커스 트랩·ESC·배경 스크롤 잠금을 쓴다.
// 내용·버튼은 쓰는 화면이 채운다(Figma 소개팅 로그인 132:3429 · 리롤 112:3773).
export function BottomSheet({
  open,
  onClose,
  label,
  hasHandle = false,
  className,
  children,
}: Props) {
  const { panelRef } = useOverlayBehavior(open, onClose);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <OverlayBackdrop onClose={onClose} />
      <div
        aria-label={label}
        aria-modal="true"
        className={cn(
          'relative flex max-h-full w-full max-w-[430px] flex-col overflow-y-auto rounded-t-20 bg-surface-default px-16 pt-24 pb-32',
          className,
        )}
        ref={panelRef}
        role="dialog"
        tabIndex={-1}
      >
        {hasHandle ? (
          <span
            aria-hidden="true"
            className="absolute top-8 left-1/2 h-4 w-24 -translate-x-1/2 rounded-999 bg-neutral-500"
          />
        ) : null}
        {children}
      </div>
    </div>,
    document.body,
  );
}
