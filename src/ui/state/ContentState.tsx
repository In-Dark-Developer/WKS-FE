import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '@/lib/cn';

type State = 'loading' | 'error' | 'empty';

type Props = Omit<ComponentPropsWithoutRef<'section'>, 'title'> & {
  state: State;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
};

const defaultCopy: Record<State, { title: string; description?: string }> = {
  loading: {
    title: '보살님이 살펴보고 있어요',
    description: '조금만 기다려 주세요.',
  },
  error: {
    title: '보살님이 잠시 길을 잃었어요',
    description: '잠시 후 다시 점쳐 주세요.',
  },
  empty: {
    title: '아직 점지된 내용이 없어요',
  },
};

function StateVisual({ state }: { state: State }) {
  if (state === 'loading') {
    return (
      <span aria-hidden="true" className="flex gap-8">
        <span className="h-8 w-8 animate-pulse rounded-999 bg-graphic-lake" />
        <span className="h-8 w-8 animate-pulse rounded-999 bg-graphic-mist" />
        <span className="h-8 w-8 animate-pulse rounded-999 bg-graphic-moonlight" />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex h-32 w-32 items-center justify-center rounded-999 text-ui-20 font-bold',
        state === 'error'
          ? 'bg-status-error-background text-status-error-foreground'
          : 'bg-surface-muted text-muted',
      )}
    >
      {state === 'error' ? '!' : '—'}
    </span>
  );
}

export function ContentState({ state, title, description, action, className, ...props }: Props) {
  const copy = defaultCopy[state];
  const role = state === 'error' ? 'alert' : 'status';
  const live = state === 'error' ? 'assertive' : 'polite';

  return (
    <section
      aria-busy={state === 'loading' ? true : undefined}
      aria-live={live}
      className={cn(
        'flex flex-col items-center rounded-20 border border-default bg-surface-default p-24 text-center',
        className,
      )}
      role={role}
      {...props}
    >
      <StateVisual state={state} />
      <h2 className="mt-16 font-display text-display-24 text-primary">{title ?? copy.title}</h2>
      {(description ?? copy.description) ? (
        <p className="mt-8 text-ui-14 text-secondary">{description ?? copy.description}</p>
      ) : null}
      {action ? <div className="mt-20">{action}</div> : null}
    </section>
  );
}
