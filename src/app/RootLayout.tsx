import { useEffect } from 'react';
import { Outlet, useMatches } from 'react-router-dom';

import { ensureDailyCheckIn } from '@/api/wallet';
import { capturePartnerRef, claimPendingPartnerRef } from '@/features/auth';

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
  // 사이트 접속 때 출석 실을 받는다 — 비로그인이면 조용히 넘어간다(ensureDailyCheckIn).
  useEffect(() => {
    void ensureDailyCheckIn();
  }, []);
  // 제휴 링크(`?ref=`)로 들어오면 코드를 보관하고, 이미 로그인했으면 바로 보상을 받는다(FR-32).
  useEffect(() => {
    capturePartnerRef(window.location.search);
    void claimPendingPartnerRef();
  }, []);
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
