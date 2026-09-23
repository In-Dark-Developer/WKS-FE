import { Outlet, useMatches } from 'react-router-dom';

import { AppShell, type Backdrop } from '@/app/AppShell';
import { BottomNavBar, type NavTab } from '@/app/screens/BottomNavBar';

// 라우트 handle 에 `{ backdrop }` 을 적으면 가장 깊은 라우트의 값이 배경이 된다 (`src/app/routes/`).
function backdropOf(handle: unknown): Backdrop | undefined {
  if (typeof handle !== 'object' || handle === null || !('backdrop' in handle)) return undefined;
  const { backdrop } = handle;
  return backdrop === 'dawn' || backdrop === 'result' || backdrop === 'mist' ? backdrop : undefined;
}

// 라우트 handle 에 `{ nav }` 를 적은 화면에만 하단 네비가 뜨고 그 탭이 선택된다(FR-19). 적지 않은 화면 —
// 티저·사주 입력·공유 Flow(`/s/**`)·궁합 이유 상세 — 에는 네비가 없다(Figma nav 가 없는 프레임).
function navOf(handle: unknown): NavTab | undefined {
  if (typeof handle !== 'object' || handle === null || !('nav' in handle)) return undefined;
  const { nav } = handle;
  return nav === 'home' || nav === 'map' || nav === 'dating' ? nav : undefined;
}

export function RootLayout() {
  const matches = useMatches();
  const backdrop = matches
    .map((match) => backdropOf(match.handle))
    .findLast((value) => value !== undefined);
  const nav = matches.map((match) => navOf(match.handle)).findLast((value) => value !== undefined);

  return (
    <AppShell backdrop={backdrop} bottomNav={nav ? <BottomNavBar active={nav} /> : undefined}>
      <Outlet />
    </AppShell>
  );
}
