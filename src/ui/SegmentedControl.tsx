import { useId } from 'react';

import { cn } from '@/lib/cn';

// Figma 디자인시스템 C07 SegmentedControl — 두 옵션 단일 선택, 48px.
type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  label: string;
  options: readonly [Option<T>, Option<T>];
  value: T | null;
  onChange: (value: T) => void;
  name?: string;
  disabled?: boolean;
  className?: string;
  'aria-describedby'?: string;
};

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  name,
  disabled = false,
  className,
  'aria-describedby': describedBy,
}: Props<T>) {
  const fallbackName = useId();

  return (
    <div
      aria-describedby={describedBy}
      aria-disabled={disabled || undefined}
      aria-label={label}
      className={cn('flex h-48 gap-8', disabled && 'opacity-45', className)}
      role="radiogroup"
    >
      {options.map((option) => (
        <label
          className={cn(
            'flex flex-1 items-center justify-center rounded-12 text-ui-16 font-medium',
            'has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-focus',
            option.value === value
              ? 'bg-action-primary-default text-inverse'
              : 'bg-surface-subtle text-primary',
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          )}
          key={option.value}
        >
          <input
            checked={option.value === value}
            className="sr-only"
            disabled={disabled}
            name={name ?? fallbackName}
            onChange={() => onChange(option.value)}
            type="radio"
            value={option.value}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}
