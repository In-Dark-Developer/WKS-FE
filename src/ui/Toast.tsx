import { createPortal } from 'react-dom';
import { useEffect, type ReactNode } from 'react';

import { cn } from '@/lib/cn';

type Props = {
  open: boolean;
  message: ReactNode;
  onClose: () => void;
  duration?: number;
  className?: string;
};

// Figma 디자인시스템 Toast — 짧은 안내(예: 클립보드 복사 폴백, ARCHITECTURE External Systems).
// 모달이 아니라 알림이라 포커스를 가져가지 않는다 — role="status"·aria-live 로만 알린다.
export function Toast({ open, message, onClose, duration = 3000, className }: Props) {
  useEffect(() => {
    if (!open) return undefined;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-16">
      <div
        aria-live="polite"
        className={cn(
          'pointer-events-auto rounded-999 bg-opacity-overlay-neutral-900-80 px-16 py-12 text-ui-14 font-medium text-inverse',
          className,
        )}
        role="status"
      >
        {message}
      </div>
    </div>,
    document.body,
  );
}
