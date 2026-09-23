import { cn } from '@/lib/cn';
import { Icon } from '@/ui/Icon';

export type BottomNavItem = { id: string; label: string; icon: string };

type Props = {
  items: readonly BottomNavItem[];
  activeId?: string;
  onSelect: (id: string) => void;
  className?: string;
};

// 하단 네비 — Figma nav(30:5661). 어느 탭이 어디로 가는지는 모른다: 탭 목록·선택된 탭을 받고
// 누른 탭의 id 를 돌려준다. 자리(viewport 하단 고정)는 쓰는 쪽이 정한다.
export function BottomNav({ items, activeId, onSelect, className }: Props) {
  return (
    <nav
      aria-label="주요 메뉴"
      className={cn(
        'flex items-start gap-40 rounded-999 border border-primary-100 bg-opacity-nav-rose-50-20 px-48 py-8 backdrop-blur-sm',
        className,
      )}
    >
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <button
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex flex-col items-center gap-4 text-ui-12 font-normal whitespace-nowrap',
              active ? 'text-opacity-nav-primary-500-80' : 'text-opacity-overlay-neutral-900-80',
            )}
            key={item.id}
            onClick={() => onSelect(item.id)}
            type="button"
          >
            {/* 아이콘은 선택 전에는 Line_icon(#24292d) 불투명, 선택하면 글자와 같은 색이다. */}
            <Icon className={active ? undefined : 'text-neutral-900'} src={item.icon} />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
