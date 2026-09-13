import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '@/lib/cn';

type Props = Omit<ComponentPropsWithoutRef<'header'>, 'title'> & {
  title: ReactNode;
  titleId?: string;
  description?: ReactNode;
  action?: ReactNode;
  headingLevel?: 2 | 3;
};

export function SectionHeader({
  title,
  titleId,
  description,
  action,
  headingLevel = 2,
  className,
  ...props
}: Props) {
  const Heading = headingLevel === 3 ? 'h3' : 'h2';

  return (
    <header className={cn('flex items-start justify-between gap-16', className)} {...props}>
      <div>
        <Heading id={titleId} className="font-display text-display-24 text-primary">
          {title}
        </Heading>
        {description ? <p className="mt-4 text-ui-14 text-secondary">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
