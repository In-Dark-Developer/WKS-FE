import { Button } from '@/ui/Button';

type State = 'loading' | 'delayed' | 'error';

type Props = { state: State; onRetry?: () => void };

const messages: Record<State, string> = {
  loading: '보살님이 점지해주는 중입니다',
  delayed: '조금 더 시간이 걸리고 있어요',
  error: '결과를 가져오지 못했어요',
};

// Figma 디자인시스템 FortuneLoading(82:564) — 결과 대기·지연·실패. 서버 진행률이 없어 백분율은 보이지 않는다.
// 애니메이션 슬롯은 디자인이 비어 있어(십이지신 애니메이션 예정) 점 세 개로 둔다.
export function FortuneLoading({ state, onRetry }: Props) {
  const isError = state === 'error';

  return (
    <section
      aria-busy={isError ? undefined : true}
      aria-live={isError ? 'assertive' : 'polite'}
      className="flex flex-col items-center gap-24 p-24"
      role={isError ? 'alert' : 'status'}
    >
      <div
        aria-hidden="true"
        className="flex w-full items-center justify-center rounded-12 bg-surface-subtle p-48"
      >
        {isError ? (
          <span className="flex size-40 items-center justify-center rounded-999 bg-status-error-background text-ui-20 font-bold text-status-error-foreground">
            !
          </span>
        ) : (
          <span className="flex h-40 items-center gap-8">
            <span className="size-8 animate-pulse rounded-999 bg-graphic-lake" />
            <span className="size-8 animate-pulse rounded-999 bg-graphic-mist [animation-delay:150ms]" />
            <span className="size-8 animate-pulse rounded-999 bg-graphic-moonlight [animation-delay:300ms]" />
          </span>
        )}
      </div>
      <p className="text-center text-ui-20 font-semibold text-primary">{messages[state]}</p>
      {isError && onRetry ? (
        <Button className="w-full" onClick={onRetry} size="l">
          다시 시도
        </Button>
      ) : null}
    </section>
  );
}
