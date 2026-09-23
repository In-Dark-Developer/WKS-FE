import { cn } from '@/lib/cn';

import './Tabs.css';

type Tab<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  label: string;
  tabs: readonly Tab<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

// 탭 — Figma button/people(109:2032). 칸을 똑같이 나눠 가진 48px 버튼들이고, 고른 탭만 분홍이다.
// 탭 아래 내용을 바꾸는 일은 부르는 쪽이 한다.
export function Tabs<T extends string>({ label, tabs, value, onChange, className }: Props<T>) {
  return (
    <div aria-label={label} className={cn('flex h-48 gap-8', className)} role="tablist">
      {tabs.map((tab) => {
        const selected = tab.value === value;
        return (
          <button
            aria-selected={selected}
            className={cn(
              'flex-1 rounded-12 text-ui-16 font-medium',
              'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus',
              selected ? 'text-inverse' : 'bg-surface-subtle text-primary',
            )}
            data-tab-selected={selected || undefined}
            key={tab.value}
            onClick={() => onChange(tab.value)}
            role="tab"
            type="button"
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
