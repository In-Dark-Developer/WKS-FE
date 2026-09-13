import type { ComponentPropsWithoutRef } from 'react';

import './layout.css';

type Props = ComponentPropsWithoutRef<'main'>;

export function AppShell({ children, className, ...props }: Props) {
  return (
    <main {...props} className={className} data-app-shell="">
      <div aria-hidden="true" data-app-shell-backdrop="">
        <div data-app-shell-stars="far" />
        <div data-app-shell-stars="near" />
      </div>
      <div data-app-shell-content="">{children}</div>
    </main>
  );
}
