import { useCallback, useEffect, useState } from 'react';
import { RouterProvider, createBrowserRouter, type RouteObject } from 'react-router-dom';

import { AppShell } from '@/app/AppShell';
import { RouteLoading } from '@/app/RouteLoading';
import { routes } from '@/app/routes';
import { OpeningSoon, SiteClosed, readOpenAt, readSiteCloseAt } from '@/features/intro';

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
const SITE_CLOSE_AT = readSiteCloseAt();
const isOpenAt = (openAt: number | null) => openAt === null || Date.now() >= openAt;
const isClosedAt = (closeAt: number | null) => closeAt !== null && Date.now() >= closeAt;
if (isOpenAt(OPEN_AT) && !isClosedAt(SITE_CLOSE_AT)) getRouter();

// setTimeout 의 최대 지연(약 24.8일) — 넘기면 곧바로 불리므로 잘라서 다시 잰다.
const MAX_TIMEOUT = 2_147_483_647;

type Props = { openAt?: number | null; closeAt?: number | null };

// 오픈 시각 전에는 주소와 무관하게 오픈 대기 화면만 그린다(공유 링크·로그인 콜백 포함).
// 종료 시각부터는 같은 방식으로 종료 화면만 그린다 — 열어 둔 화면도 새로고침 없이 바뀐다.
export function App({ openAt = OPEN_AT, closeAt = SITE_CLOSE_AT }: Props) {
  const [isOpen, setIsOpen] = useState(() => isOpenAt(openAt));
  const [now, setNow] = useState(() => Date.now());
  const isClosed = closeAt !== null && now >= closeAt;
  const open = useCallback(() => {
    getRouter();
    setIsOpen(true);
  }, []);

  useEffect(() => {
    if (closeAt === null || isClosed) return;
    const timer = setTimeout(() => setNow(Date.now()), Math.min(closeAt - now, MAX_TIMEOUT));
    return () => clearTimeout(timer);
  }, [closeAt, isClosed, now]);

  if (isClosed) {
    return (
      <AppShell>
        <SiteClosed />
      </AppShell>
    );
  }
  if (!isOpen && openAt !== null) {
    return (
      <AppShell>
        <OpeningSoon onOpen={open} openAt={openAt} />
      </AppShell>
    );
  }
  return <RouterProvider router={getRouter()} />;
}
