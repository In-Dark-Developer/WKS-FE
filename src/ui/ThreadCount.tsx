import { cn } from '@/lib/cn';

type Props = {
  // 백엔드가 준 잔액 그대로 — 이 컴포넌트는 더하거나 빼지 않는다.
  count: number;
  label?: string;
  className?: string;
};

// 재화 '실' 잔액 — Figma 해금 모달의 '보유 10개'(110:2660). 소개팅 상단과 모달이 같이 쓴다.
export function ThreadCount({ count, label = '보유', className }: Props) {
  return (
    <p
      aria-label={`운명의 실 ${label} ${count}개`}
      className={cn(
        'inline-flex items-center gap-4 rounded-8 bg-surface-rose px-8 whitespace-nowrap',
        className,
      )}
    >
      <span aria-hidden="true" className="text-ui-12 text-muted">
        {label}
      </span>
      <span aria-hidden="true" className="text-ui-14 text-primary">
        {count}개
      </span>
    </p>
  );
}
