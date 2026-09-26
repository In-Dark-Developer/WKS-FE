import type { RouteObject } from 'react-router-dom';
import { useLoaderData, useRevalidator, useSearchParams } from 'react-router-dom';

import { logout } from '@/api/auth';
import { requireAuth, requireDatingProfile } from '@/app/routes/guards';
import { goToKakaoLogin } from '@/features/auth';
import {
  DatingCardsScreen,
  DatingIntroScreen,
  DatingProfileScreen,
  DatingRequestsScreen,
  DATING_PROFILE_PATH,
  NotVerifiedNotice,
  datingCardsLoader,
  datingRequestsLoader,
  datingIntroLoader,
  datingProfileLoader,
  type DatingCardsState,
  type DatingIntroView,
  type DatingProfileStart,
  type RequestInboxView,
} from '@/features/dating';

// 소개팅(Phase 10·11). 인트로는 가드가 없다 — 사주 없이도 소개팅부터 볼 수 있고(기능명세서 1.3), 로그인·프로필
// 조건은 인트로가 GET /me 로 판단한다(FR-24). 프로필 등록·Top 3 는 requireAuth·requireDatingProfile 이 막는다.

// 로그인은 카카오 왕복 뒤 곧장 프로필 등록으로 간다(Figma Intro 1.1.1 → 사주입력폼) — 등록 단계는 그 loader 가
// GET /me 로 정하고, 이미 등록했으면 Top 3 로 보낸다. 로그아웃은 백엔드가 세션 쿠키를 지운 뒤 GET /me 를 다시 읽는다.
function DatingIntroRoute() {
  const view = useLoaderData<DatingIntroView>();
  const revalidator = useRevalidator();
  return (
    <DatingIntroScreen
      onKakaoLogin={() => goToKakaoLogin(DATING_PROFILE_PATH)}
      onLogout={() => {
        void logout().then((outcome) => {
          if (!outcome.ok) console.error('로그아웃 실패', outcome.error);
          void revalidator.revalidate();
        });
      }}
      view={view}
    />
  );
}

function DatingProfileRoute() {
  const start = useLoaderData<DatingProfileStart>();
  return <DatingProfileScreen start={start} />;
}

function DatingCardsRoute() {
  const state = useLoaderData<DatingCardsState>();
  if (state.kind === 'not-verified') return <NotVerifiedNotice />;
  return <DatingCardsScreen view={state.view} />;
}

// '보러가기'(운명의 실 보낸 뒤)는 `?tab=sent` 로 보낸 신청 탭을 연다.
function DatingRequestsRoute() {
  const view = useLoaderData<RequestInboxView>();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'received' ? 'received' : 'sent';
  return <DatingRequestsScreen initialTab={initialTab} view={view} />;
}

export const datingRoutes: RouteObject[] = [
  {
    path: 'dating',
    handle: { nav: 'dating' },
    loader: datingIntroLoader,
    element: <DatingIntroRoute />,
  },
  {
    path: 'dating/profile',
    loader: async () => datingProfileLoader(await requireAuth()),
    // 단계(`?step=`)만 바뀌면 다시 부르지 않는다 — 입력 중인 폼이 그대로여야 하고 GET /me 를 또 부를 이유가 없다.
    shouldRevalidate: ({ currentUrl, nextUrl, defaultShouldRevalidate }) =>
      currentUrl.pathname === nextUrl.pathname ? false : defaultShouldRevalidate,
    element: <DatingProfileRoute />,
  },
  {
    // SCR-17 Top 3 카드 (FR-26 · FR-27).
    path: 'dating/cards',
    handle: { nav: 'dating' },
    loader: async () => {
      await requireDatingProfile();
      return datingCardsLoader();
    },
    element: <DatingCardsRoute />,
  },
  {
    // SCR-20 요청함 (FR-30).
    path: 'dating/requests',
    handle: { nav: 'dating' },
    loader: async () => {
      await requireDatingProfile();
      return datingRequestsLoader();
    },
    element: <DatingRequestsRoute />,
  },
];
