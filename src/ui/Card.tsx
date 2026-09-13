import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '@/lib/cn';

type Props = Omit<ComponentPropsWithoutRef<'section'>, 'children'> & {
  header?: ReactNode;
  media?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

export function Card({ header, media, children, footer, className, ...props }: Props) {
  return (
    <section
      className={cn(
        'overflow-hidden rounded-20 border border-default bg-surface-default',
        className,
      )}
      {...props}
    >
      {header ? <div className="border-b border-default p-16">{header}</div> : null}
      {media ? <div className="bg-surface-subtle">{media}</div> : null}
      <div className="p-20">{children}</div>
      {footer ? <div className="border-t border-default p-16">{footer}</div> : null}
    </section>
  );
}
