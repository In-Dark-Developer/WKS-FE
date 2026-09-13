import type { ComponentPropsWithoutRef } from 'react';

import './layout.css';

// 화면별 배경 — Figma 「UI 최종 - 개발용」 기본(695:2501) · 사주 결과(558:2432) · 사전신청 모달(558:2568).
export type Backdrop = 'dawn' | 'result' | 'mist';

type Props = ComponentPropsWithoutRef<'main'> & { backdrop?: Backdrop };

export function AppShell({ backdrop = 'dawn', children, className, ...props }: Props) {
  return (
    <main {...props} className={className} data-app-shell="" data-backdrop={backdrop}>
      <div aria-hidden="true" data-app-shell-backdrop="" />
      <div data-app-shell-content="">{children}</div>
    </main>
  );
}
