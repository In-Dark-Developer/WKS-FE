import { createPortal } from 'react-dom';
import { useEffect, useId, useRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { cn } from '@/lib/cn';
import closeIcon from '@/ui/assets/icons/close.svg';
import { IconButton } from '@/ui/IconButton';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Modal·ShareSheet(둘 다 오버레이)가 함께 쓰는 동작 — 포커스 트랩·ESC 닫기·배경 스크롤 잠금·닫힐 때
// 이전 포커스 복원. 시각(가운데 정렬 vs 바텀시트)은 각 컴포넌트가 스스로 그린다.
export function useOverlayBehavior(open: boolean, onClose: () => void) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusables = () => Array.from(panel?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    (focusables()[0] ?? panel)?.focus();

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  return { panelRef, titleId };
}

// 배경을 마우스로 눌러 닫는 자리 — 누를 수 있는 건 button 이어야 하지만(CONVENTIONS 7장)
// 키보드 포커스 순서에는 없어야 해서 tabIndex=-1·aria-hidden 으로 뺀다.
export function OverlayBackdrop({ onClose }: { onClose: () => void }) {
  return (
    <button
      aria-hidden="true"
      className="absolute inset-0 bg-opacity-overlay-neutral-900-80"
      onClick={onClose}
      tabIndex={-1}
      type="button"
    />
  );
}

type Props = Omit<ComponentPropsWithoutRef<'div'>, 'title'> & {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
};

// Figma 디자인시스템 Modal — 가운데 정렬 오버레이. 포커스 트랩·ESC 닫기·배경 스크롤 잠금.
export function Modal({ open, onClose, title, children, className, ...props }: Props) {
  const { panelRef, titleId } = useOverlayBehavior(open, onClose);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-16">
      <OverlayBackdrop onClose={onClose} />
      <div
        aria-labelledby={title ? titleId : undefined}
        aria-modal="true"
        className={cn(
          'relative flex max-h-full w-full max-w-[400px] flex-col gap-16 overflow-y-auto rounded-20 bg-surface-default p-20',
          className,
        )}
        ref={panelRef}
        role="dialog"
        tabIndex={-1}
        {...props}
      >
        <div className="flex items-center justify-between gap-16">
          {title ? (
            <h2 className="text-ui-18 font-semibold text-primary" id={titleId}>
              {title}
            </h2>
          ) : (
            <span />
          )}
          <IconButton icon={closeIcon} label="닫기" onClick={onClose} />
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
