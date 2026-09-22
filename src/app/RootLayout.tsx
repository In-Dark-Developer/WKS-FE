import { Outlet, useMatches } from 'react-router-dom';

import { AppShell, type Backdrop } from '@/app/AppShell';

// 라우트 handle 에 `{ backdrop }` 을 적으면 가장 깊은 라우트의 값이 배경이 된다 (`src/app/routes/`).
function backdropOf(handle: unknown): Backdrop | undefined {
  if (typeof handle !== 'object' || handle === null || !('backdrop' in handle)) return undefined;
  const { backdrop } = handle;
  return backdrop === 'dawn' || backdrop === 'result' || backdrop === 'mist' ? backdrop : undefined;
}

export function RootLayout() {
  const backdrop = useMatches()
    .map((match) => backdropOf(match.handle))
    .findLast((value) => value !== undefined);

  return (
    <AppShell backdrop={backdrop}>
      <Outlet />
    </AppShell>
  );
}
