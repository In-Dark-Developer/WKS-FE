import { useId, useRef, useState, type KeyboardEvent } from 'react';

import { cn } from '@/lib/cn';
import checkIcon from '@/ui/assets/icons/check.svg';
import chevronIcon from '@/ui/assets/icons/chevron-down.svg';
import { Icon } from '@/ui/Icon';

// Figma 디자인시스템 C08 SelectTrigger + C09 OptionRow — 트리거 아래로 옵션 목록이 펼쳐진다.
// 옵션 데이터(12시진·MBTI 등)는 쓰는 화면이 props 로 넘긴다.
// appearance 'soft' 는 화면(수정본) 모습 — Surface/Subtle 배경·Border/Default 테두리, 고른 옵션은 Action/Teal.
export type SelectOption<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  options: readonly SelectOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  placeholder?: string;
  name?: string;
  id?: string;
  disabled?: boolean;
  readOnly?: boolean;
  appearance?: 'default' | 'soft';
  className?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-label'?: string;
};

export function Select<T extends string>({
  options,
  value,
  onChange,
  placeholder = '선택해 주세요',
  name,
  id,
  disabled = false,
  readOnly = false,
  appearance = 'default',
  className,
  'aria-describedby': describedBy,
  'aria-invalid': ariaInvalid,
  'aria-label': ariaLabel,
}: Props<T>) {
  const fallbackId = useId();
  const triggerId = id ?? fallbackId;
  const listId = `${triggerId}-list`;
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;
  const invalid = ariaInvalid === true || ariaInvalid === 'true';
  const canOpen = !disabled && !readOnly;

  function openList() {
    if (!canOpen) return;
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  }

  function choose(index: number) {
    const option = options[index];
    if (option) onChange(option.value);
    setOpen(false);
  }

  function moveTo(index: number) {
    const next = Math.max(0, Math.min(options.length - 1, index));
    setActiveIndex(next);
    listRef.current?.children[next]?.scrollIntoView?.({ block: 'nearest' });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        openList();
      }
      return;
    }
    const keys: Record<string, () => void> = {
      ArrowDown: () => moveTo(activeIndex + 1),
      ArrowUp: () => moveTo(activeIndex - 1),
      Home: () => moveTo(0),
      End: () => moveTo(options.length - 1),
      Enter: () => choose(activeIndex),
      ' ': () => choose(activeIndex),
      Escape: () => setOpen(false),
    };
    const action = keys[event.key];
    if (action) {
      event.preventDefault();
      action();
    } else if (event.key === 'Tab') {
      setOpen(false);
    }
  }

  return (
    <div className={cn('relative', className)}>
      {name ? <input name={name} type="hidden" value={value ?? ''} /> : null}
      <button
        aria-activedescendant={open && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
        aria-controls={listId}
        aria-describedby={describedBy}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-invalid={invalid || undefined}
        aria-label={ariaLabel}
        aria-readonly={readOnly || undefined}
        className={cn(
          'flex h-48 w-full items-center gap-8 rounded-12 border p-12 text-left text-ui-16',
          'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus',
          invalid
            ? 'border-status-error-foreground'
            : appearance === 'soft'
              ? 'border-default'
              : 'border-neutral',
          disabled
            ? 'cursor-not-allowed border-disabled bg-surface-muted text-action-disabled-foreground'
            : readOnly || appearance === 'soft'
              ? 'bg-surface-subtle text-primary'
              : 'bg-surface-default text-primary',
        )}
        disabled={disabled}
        id={triggerId}
        onBlur={() => setOpen(false)}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={handleKeyDown}
        role="combobox"
        type="button"
      >
        <span
          className={cn(
            'min-w-0 flex-1 truncate',
            !selected && (appearance === 'soft' ? 'text-disabled' : 'text-muted'),
          )}
        >
          {selected ? selected.label : placeholder}
        </span>
        <Icon className={cn(open && 'rotate-180')} src={chevronIcon} />
      </button>
      <ul
        className={cn(
          // 목록 높이는 6행(48px × 6)까지 보이고 나머지는 스크롤한다 — Space 토큰에 288 이 없어 값으로 둔다.
          'absolute inset-x-0 top-full z-10 mt-4 max-h-[288px] overflow-y-auto rounded-12 border border-default bg-surface-default p-4',
          !open && 'hidden',
        )}
        id={listId}
        ref={listRef}
        role="listbox"
      >
        {options.map((option, index) => (
          <li
            aria-selected={option.value === value}
            className={cn(
              'flex h-48 cursor-pointer items-center gap-8 rounded-8 p-12 text-ui-16 text-primary',
              option.value === value &&
                (appearance === 'soft'
                  ? 'bg-action-teal-default text-inverse'
                  : 'bg-surface-selected'),
              index === activeIndex && 'outline-2 -outline-offset-2 outline-focus',
            )}
            id={`${listId}-${index}`}
            key={option.value}
            // 트리거의 blur 보다 먼저 고르도록 mousedown 기본 동작(포커스 이동)을 막는다.
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => choose(index)}
            role="option"
          >
            <span className="min-w-0 flex-1 truncate">{option.label}</span>
            {option.value === value ? <Icon src={checkIcon} /> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
