import { useState, type ChangeEvent, type ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/cn';

// Figma 디자인시스템 C06 TextArea — 여러 줄 + 글자 수 카운터, 6개 상태.
type Props = ComponentPropsWithoutRef<'textarea'>;

export function TextArea({
  className,
  disabled,
  readOnly,
  maxLength,
  value,
  defaultValue,
  onChange,
  rows = 4,
  ...props
}: Props) {
  const [uncontrolledLength, setUncontrolledLength] = useState(String(defaultValue ?? '').length);
  const length = value === undefined ? uncontrolledLength : String(value).length;
  const invalid = props['aria-invalid'] === true || props['aria-invalid'] === 'true';

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setUncontrolledLength(event.target.value.length);
    onChange?.(event);
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-8 rounded-12 border p-12',
        'focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-focus',
        invalid ? 'border-status-error-foreground' : 'border-neutral',
        disabled
          ? 'border-disabled bg-surface-muted'
          : readOnly
            ? 'bg-surface-subtle'
            : 'bg-surface-default',
        className,
      )}
    >
      <textarea
        className="w-full resize-none bg-transparent text-ui-16 text-primary outline-none placeholder:text-muted disabled:text-action-disabled-foreground"
        defaultValue={defaultValue}
        disabled={disabled}
        maxLength={maxLength}
        onChange={handleChange}
        readOnly={readOnly}
        rows={rows}
        value={value}
        {...props}
      />
      {maxLength !== undefined ? (
        <p aria-live="polite" className="text-ui-12 text-muted">
          {length} / {maxLength}
        </p>
      ) : null}
    </div>
  );
}
