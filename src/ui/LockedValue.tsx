import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';
import lockImage from '@/ui/assets/lock.webp';

type Props = {
  // 가운데 알약에 적을 말(예: '학과 5개로 열기'). 값이 무엇인지·얼마인지는 부르는 쪽이 정한다.
  label: string;
  // 알약 뒤에 흐리게 깔 자리 — 실제 값이 아니라 가짜 글이어야 한다. 없으면 알약만 그린다.
  children?: ReactNode;
  // 주면 알약이 버튼이 된다.
  onUnlock?: () => void;
  className?: string;
};

// 잠긴 값 — 흐린 자리 위 가운데에 자물쇠 알약을 얹는다(Figma 112:3296 '학과 5개로 열기').
export function LockedValue({ label, children, onUnlock, className }: Props) {
  const pill = (
    <>
      <img alt="" className="size-[18px]" draggable={false} src={lockImage} />
      {label}
    </>
  );
  const pillClass =
    'flex items-center gap-4 rounded-999 border border-rose-50 bg-opacity-card-rose-50-50 px-8 py-4 text-ui-12 whitespace-nowrap text-neutral-50 backdrop-blur-sm';

  return (
    <div className={cn('relative', className)}>
      {children ? (
        <div aria-hidden="true" className="blur-sm select-none">
          {children}
        </div>
      ) : null}
      <div
        className={cn(
          'flex items-center justify-center',
          children ? 'absolute inset-0' : undefined,
        )}
      >
        {onUnlock ? (
          <button className={pillClass} onClick={onUnlock} type="button">
            {pill}
          </button>
        ) : (
          <span className={pillClass}>{pill}</span>
        )}
      </div>
    </div>
  );
}
