import type { RouteObject } from 'react-router-dom';

import { AppShell } from '@/app/AppShell';
import { RootLayout } from '@/app/RootLayout';
import { RouteError } from '@/app/RouteError';
import { RouteLoading } from '@/app/RouteLoading';
import { datingRoutes } from '@/app/routes/dating.routes';
import { mapRoutes } from '@/app/routes/map.routes';
import { sajuRoutes } from '@/app/routes/saju.routes';
import { shareRoutes } from '@/app/routes/share.routes';

// 라우트 등록은 영역별 파일(`*.routes.tsx`)이 하고 이 파일은 합치기만 한다 — 화면이 늘어도 한 파일에서
// 충돌하지 않게 하려는 것이다. 각 화면은 컴포넌트·loader·action 만 export 하고 조립은 `src/app/screens/`,
// 가드는 `guards.ts` 가 갖는다. 배경은 handle.backdrop 으로 정한다 — 'dawn'(기본) · 'result'(사주 결과) ·
// 'mist'(사전신청 모달). 하단 네비는 handle.nav 로 켜고 그 탭을 고른다 — 'home' · 'map' · 'dating'.
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: (
      <AppShell>
        <RouteError />
      </AppShell>
    ),
    hydrateFallbackElement: (
      <AppShell>
        <RouteLoading />
      </AppShell>
    ),
    children: [...sajuRoutes, ...shareRoutes, ...mapRoutes, ...datingRoutes],
  },
];
