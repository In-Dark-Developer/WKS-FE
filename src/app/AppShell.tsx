import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import './layout.css';

// 화면별 배경 — Figma 「UI 최종 - 개발용」 기본(695:2501) · 사주 결과(558:2432) · 사전신청 모달(558:2568).
export type Backdrop = 'dawn' | 'result' | 'mist';

type Props = ComponentPropsWithoutRef<'main'> & { backdrop?: Backdrop; bottomNav?: ReactNode };

// bottomNav 가 있으면 콘텐츠 아래 여백을 네비 높이만큼 늘려 마지막 줄이 네비에 가리지 않게 한다(layout.css).
export function AppShell({ backdrop = 'dawn', bottomNav, children, className, ...props }: Props) {
  return (
    <main
      {...props}
      className={className}
      data-app-shell=""
      data-backdrop={backdrop}
      data-with-nav={bottomNav ? '' : undefined}
    >
      <div aria-hidden="true" data-app-shell-backdrop="" />
      <div data-app-shell-content="">{children}</div>
      {bottomNav}
    </main>
  );
}
