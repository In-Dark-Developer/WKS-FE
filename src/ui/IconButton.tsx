import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/cn';
import { Icon } from '@/ui/Icon';

// Figma 디자인시스템 C02 IconButton — 44×44 터치 영역, Ghost·Surface.
type Props = Omit<ComponentPropsWithoutRef<'button'>, 'children'> & {
  icon: string;
  label: string;
  appearance?: 'ghost' | 'surface';
};

export function IconButton({
  icon,
  label,
  appearance = 'ghost',
  type = 'button',
  className,
  ...props
}: Props) {
  return (
    <button
      aria-label={label}
      className={cn(
        // 44px 는 Figma 터치 영역 값이다 — Space 토큰에 44 가 없어 값으로 둔다.
        'inline-flex size-[44px] shrink-0 items-center justify-center rounded-12 text-primary',
        'hover:bg-surface-selected active:bg-surface-selected disabled:cursor-not-allowed',
        'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus',
        appearance === 'surface'
          ? 'bg-surface-subtle disabled:bg-surface-selected'
          : 'disabled:bg-transparent',
        className,
      )}
      type={type}
      {...props}
    >
      <Icon className={props.disabled ? 'opacity-35' : undefined} src={icon} />
    </button>
  );
}
