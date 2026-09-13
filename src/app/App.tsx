import { RouterProvider, createBrowserRouter, type RouteObject } from 'react-router-dom';

import { AppShell } from '@/app/AppShell';
import { RouteLoading } from '@/app/RouteLoading';
import { routes } from '@/app/routes';

// 퍼블리싱 확인 `/preview` 는 개발 서버에서만 붙는다 — 빌드에서는 이 분기와 preview 청크가 빠진다 (03/T6).
const previewRoutes: RouteObject[] = import.meta.env.DEV
  ? [
      {
        path: '/preview/*',
        hydrateFallbackElement: (
          <AppShell>
            <RouteLoading />
          </AppShell>
        ),
        lazy: async () => {
          const { PreviewRoute, previewAction } = await import('@/app/preview/PreviewRoute');
          return { Component: PreviewRoute, action: previewAction };
        },
      },
    ]
  : [];

const router = createBrowserRouter([...previewRoutes, ...routes]);

export function App() {
  return <RouterProvider router={router} />;
}
