import { useId, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { cn } from '@/lib/cn';
import checkIcon from '@/ui/assets/icons/check.svg';
import { Icon } from '@/ui/Icon';

// Figma 디자인시스템 C10 Checkbox — 44px 터치행, Default·Focus·Disabled·Error.
type Props = Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'children'> & {
  label: ReactNode;
  invalid?: boolean;
};

export function Checkbox({ label, invalid = false, id, className, disabled, ...props }: Props) {
  const fallbackId = useId();
  const inputId = id ?? fallbackId;

  return (
    <label
      className={cn(
        // 44px 는 Figma 터치행 높이다 — Space 토큰에 44 가 없어 값으로 둔다.
        'inline-flex min-h-[44px] items-center gap-8 text-ui-14 text-primary',
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
          'inline-flex size-24 shrink-0 items-center justify-center rounded-8 border bg-surface-default text-transparent',
          'peer-checked:bg-action-primary-default peer-checked:text-inverse',
          'peer-focus-visible:outline-2 peer-focus-visible:-outline-offset-2 peer-focus-visible:outline-focus',
          invalid ? 'border-status-error-foreground' : 'border-neutral',
        )}
      >
        <Icon src={checkIcon} />
      </span>
      {label}
    </label>
  );
}
