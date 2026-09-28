import { useCallback, useState } from 'react';
import { RouterProvider, createBrowserRouter, type RouteObject } from 'react-router-dom';

import { AppShell } from '@/app/AppShell';
import { RouteLoading } from '@/app/RouteLoading';
import { routes } from '@/app/routes';
import { OpeningSoon, readOpenAt } from '@/features/intro';

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

// 라우터는 만들면서 지금 주소의 loader 를 돌린다. 오픈 전에는 만들지 않아야 어떤 화면의 요청도 나가지 않는다.
// 렌더 밖(모듈 · 오픈 콜백)에서만 만든다 — 렌더 중에 만들면 loader 결과를 RouterProvider 가 놓칠 수 있다.
let router: ReturnType<typeof createBrowserRouter> | undefined;
function getRouter() {
  router ??= createBrowserRouter([...previewRoutes, ...routes]);
  return router;
}

const OPEN_AT = readOpenAt();
const isOpenAt = (openAt: number | null) => openAt === null || Date.now() >= openAt;
if (isOpenAt(OPEN_AT)) getRouter();

type Props = { openAt?: number | null };

// 오픈 시각 전에는 주소와 무관하게 오픈 대기 화면만 그린다(공유 링크·로그인 콜백 포함).
export function App({ openAt = OPEN_AT }: Props) {
  const [isOpen, setIsOpen] = useState(() => isOpenAt(openAt));
  const open = useCallback(() => {
    getRouter();
    setIsOpen(true);
  }, []);

  if (!isOpen && openAt !== null) {
    return (
      <AppShell>
        <OpeningSoon onOpen={open} openAt={openAt} />
      </AppShell>
    );
  }
  return <RouterProvider router={getRouter()} />;
}
