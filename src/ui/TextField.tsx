import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/cn';
import closeIcon from '@/ui/assets/icons/close.svg';
import { Icon } from '@/ui/Icon';

// Figma 디자인시스템 C05 TextInput — 48px, Default·Focus·Filled·Error·Disabled·ReadOnly.
// appearance 'soft' 는 화면(수정본) 모습 — Surface/Subtle 배경·Border/Default 테두리, 'soft-apricot' 은 테두리만 Border/Apricot.
type Props = Omit<ComponentPropsWithoutRef<'input'>, 'size'> & {
  onClear?: () => void;
  clearLabel?: string;
  appearance?: 'default' | 'soft' | 'soft-apricot';
};

const borderClass = {
  default: 'border-neutral',
  soft: 'border-default',
  'soft-apricot': 'border-apricot',
};

export function TextField({
  onClear,
  clearLabel = '입력 지우기',
  appearance = 'default',
  className,
  disabled,
  readOnly,
  value,
  ...props
}: Props) {
  const invalid = props['aria-invalid'] === true || props['aria-invalid'] === 'true';
  const canClear =
    onClear !== undefined && !disabled && !readOnly && value !== undefined && value !== '';

  return (
    <div
      className={cn(
        'flex h-48 items-center gap-8 rounded-12 border p-12',
        'focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-focus',
        invalid ? 'border-status-error-foreground' : borderClass[appearance],
        disabled
          ? 'border-disabled bg-surface-muted'
          : readOnly || appearance !== 'default'
            ? 'bg-surface-subtle'
            : 'bg-surface-default',
        className,
      )}
    >
      <input
        className={cn(
          'min-w-0 flex-1 bg-transparent text-ui-16 text-primary outline-none disabled:text-action-disabled-foreground',
          appearance === 'default' ? 'placeholder:text-muted' : 'placeholder:text-disabled',
        )}
        disabled={disabled}
        readOnly={readOnly}
        value={value}
        {...props}
      />
      {canClear ? (
        <button
          aria-label={clearLabel}
          className="inline-flex shrink-0 rounded-8 text-secondary focus-visible:outline-2 focus-visible:outline-focus"
          onClick={onClear}
          type="button"
        >
          <Icon src={closeIcon} />
        </button>
      ) : null}
    </div>
  );
}
