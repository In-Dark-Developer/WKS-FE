import { useId, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { cn } from '@/lib/cn';
import checkIcon from '@/ui/assets/icons/check.svg';
import { Icon } from '@/ui/Icon';

// Figma 디자인시스템 C10 Checkbox — 44px 터치행, Default·Focus·Disabled·Error.
// appearance 'accent' 는 화면(수정본) 모습 — 체크 Action/Teal, 상자 Surface/Subtle·Border/Default, 라벨 Text/Secondary.
type Props = Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'children'> & {
  label: ReactNode;
  invalid?: boolean;
  appearance?: 'default' | 'accent';
};

export function Checkbox({
  label,
  invalid = false,
  appearance = 'default',
  id,
  className,
  disabled,
  ...props
}: Props) {
  const fallbackId = useId();
  const inputId = id ?? fallbackId;

  return (
    <label
      className={cn(
        // 44px 는 Figma 터치행 높이다 — Space 토큰에 44 가 없어 값으로 둔다.
        'inline-flex min-h-[44px] items-center gap-8 text-ui-14',
        appearance === 'accent' ? 'text-secondary' : 'text-primary',
        disabled ? 'cursor-not-allowed opacity-45' : 'cursor-pointer',
        className,
      )}
      htmlFor={inputId}
    >
      <input
        aria-invalid={invalid || undefined}
        className="peer sr-only"
        disabled={disabled}
        id={inputId}
        type="checkbox"
        {...props}
      />
      <span
        aria-hidden="true"
        className={cn(
          'inline-flex size-24 shrink-0 items-center justify-center rounded-8 border text-transparent peer-checked:text-inverse',
          appearance === 'accent'
            ? 'bg-surface-subtle peer-checked:bg-action-teal-default'
            : 'bg-surface-default peer-checked:bg-action-primary-default',
          'peer-focus-visible:outline-2 peer-focus-visible:-outline-offset-2 peer-focus-visible:outline-focus',
          invalid
            ? 'border-status-error-foreground'
            : appearance === 'accent'
              ? 'border-default'
              : 'border-neutral',
        )}
      >
        <Icon src={checkIcon} />
      </span>
      {label}
    </label>
  );
}
