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

// 카카오 로그인 스파이크(더미 페이지) — /preview 와 같은 이유로 개발 서버에서만 붙는다. 실제 소개팅
// 로그인 화면은 06-dating-gate Phase 에서 만든다(ADR-20260922-kakao-login-and-jwt-session).
const devAuthRoutes: RouteObject[] = import.meta.env.DEV
  ? [
      {
        path: '/dev/kakao',
        hydrateFallbackElement: (
          <AppShell>
            <RouteLoading />
          </AppShell>
        ),
        lazy: async () => {
          const { KakaoLoginTestPage } = await import('@/app/dev/KakaoLoginTestPage');
          return { Component: KakaoLoginTestPage };
        },
      },
      {
        path: '/dev/kakao-callback',
        hydrateFallbackElement: (
          <AppShell>
            <RouteLoading />
          </AppShell>
        ),
        lazy: async () => {
          const { KakaoCallbackPage, kakaoCallbackLoader } =
            await import('@/app/dev/KakaoCallbackPage');
          return { Component: KakaoCallbackPage, loader: kakaoCallbackLoader };
        },
      },
    ]
  : [];

const router = createBrowserRouter([...previewRoutes, ...devAuthRoutes, ...routes]);

export function App() {
  return <RouterProvider router={router} />;
}
