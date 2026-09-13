import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '@/lib/cn';
import spinnerIcon from '@/ui/assets/icons/spinner.svg';
import { Icon } from '@/ui/Icon';

// Figma 디자인시스템 C01 Button/Primary·Accent·Secondary·Ghost (M 48 · L 56).
type Variant = 'primary' | 'accent' | 'secondary' | 'ghost';
type Size = 'm' | 'l';

type Props = ComponentPropsWithoutRef<'button'> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  loadingLabel?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

const variantClass: Record<Variant, string> = {
  primary:
    'bg-action-primary-default text-inverse hover:bg-action-primary-hover active:bg-action-primary-pressed',
  accent:
    'bg-action-teal-default text-inverse hover:bg-action-teal-hover active:bg-action-teal-pressed',
  secondary:
    'border border-secondary-default bg-action-secondary-default text-action-secondary-foreground hover:border-secondary-hover hover:bg-action-secondary-hover active:border-secondary-pressed active:bg-action-secondary-pressed focus-visible:outline-secondary-focus',
  ghost: 'text-brand hover:bg-surface-selected active:bg-surface-selected',
};

const disabledClass: Record<Variant, string> = {
  primary: 'disabled:bg-action-disabled-background disabled:text-action-disabled-foreground',
  accent: 'disabled:bg-action-disabled-background disabled:text-action-disabled-foreground',
  secondary:
    'disabled:border-secondary-disabled disabled:bg-action-disabled-background disabled:text-action-disabled-foreground',
  ghost: 'disabled:bg-transparent disabled:text-action-disabled-foreground',
};

export function Button({
  variant = 'primary',
  size = 'l',
  loading = false,
  loadingLabel = '처리 중',
  leadingIcon,
  trailingIcon,
  type = 'button',
  disabled,
  className,
  children,
  ...props
}: Props) {
  return (
    <button
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex items-center justify-center gap-8 rounded-12 px-16 text-ui-16 font-semibold',
        'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus',
        // Figma L 56 · M 48 (Secondary 테두리 포함). Space 토큰에 56 이 없어 값으로 둔다.
        size === 'l' ? 'h-[56px]' : 'h-48',
        variantClass[variant],
        // 로딩 중에는 누를 수 없지만 비활성 모습이 아니라 로딩 모습을 보인다 (Figma State=Loading).
        loading ? 'cursor-progress' : cn(disabledClass[variant], 'disabled:cursor-not-allowed'),
        className,
      )}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading ? (
        <>
          <Icon className="animate-spin" src={spinnerIcon} />
          {loadingLabel}
        </>
      ) : (
        <>
          {leadingIcon}
          {children}
          {trailingIcon}
        </>
      )}
    </button>
  );
}
