import { cn } from '@/lib/cn';

type Size = 'sm' | 'md' | 'lg';

type Props = {
  // 사진이 없으면 이름 첫 글자를 보인다.
  src?: string;
  name: string;
  size?: Size;
  className?: string;
};

const sizeClass: Record<Size, string> = {
  sm: 'size-32 text-ui-14',
  md: 'size-48 text-ui-18',
  lg: 'size-[64px] text-ui-24',
};

// 둥근 프로필 사진 — 소개팅 요청함·상세(Phase 11)에서 상대를 작게 보일 때 쓴다(FR-25).
export function Avatar({ src, name, size = 'md', className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-999 bg-surface-rose font-semibold text-rose-700',
        sizeClass[size],
        className,
      )}
    >
      {src ? (
        <img alt={name} className="size-full object-cover" draggable={false} src={src} />
      ) : (
        <span aria-label={name} role="img">
          {[...name.trim()][0] ?? ''}
        </span>
      )}
    </span>
  );
}
