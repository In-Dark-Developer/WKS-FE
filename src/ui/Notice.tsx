import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '@/lib/cn';

type Props = ComponentPropsWithoutRef<'aside'> & {
  title?: ReactNode;
};

export function Notice({ title, children, className, ...props }: Props) {
  return (
    <aside
      className={cn('rounded-12 border border-default bg-surface-brand p-16', className)}
      role="note"
      {...props}
    >
      {title ? <p className="text-ui-14 font-semibold text-primary">{title}</p> : null}
      <div className={cn('text-ui-14 text-secondary', title && 'mt-4')}>{children}</div>
    </aside>
  );
}
