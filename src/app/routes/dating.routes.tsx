import type { RouteObject } from 'react-router-dom';
import { useLoaderData, useRevalidator } from 'react-router-dom';

import { signInMockAccount, signOutMockAccount } from '@/api/me';
import { Placeholder } from '@/app/Placeholder';
import { requireAuth, requireDatingProfile } from '@/app/routes/guards';
import {
  DatingIntroScreen,
  DatingProfileScreen,
  datingIntroLoader,
  datingProfileLoader,
  type DatingIntroView,
  type DatingProfileStart,
} from '@/features/dating';

// 소개팅(Phase 10·11). 인트로는 가드가 없다 — 사주 없이도 소개팅부터 볼 수 있고(기능명세서 1.3), 로그인·프로필
// 조건은 인트로가 GET /me 로 판단한다(FR-24). 프로필 등록·Top 3 는 requireAuth·requireDatingProfile 이 막는다.

// 카카오 로그인·로그아웃은 로그인 Task(09/T2, features/auth)가 붙인다. 그 전까지는 `VITE_API_MOCK=true` 의
// 목 계정만 켜고 끈다 — 실제 모드에서는 GET /me 가 계속 401 이라 비로그인 인트로에 남는다.
function DatingIntroRoute() {
  const view = useLoaderData<DatingIntroView>();
  const revalidator = useRevalidator();
  return (
    <DatingIntroScreen
      onKakaoLogin={() => {
        signInMockAccount();
        void revalidator.revalidate();
      }}
      onLogout={() => {
        signOutMockAccount();
        void revalidator.revalidate();
      }}
      view={view}
    />
  );
}

function DatingProfileRoute() {
  const start = useLoaderData<DatingProfileStart>();
  return <DatingProfileScreen start={start} />;
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
    element: <DatingProfileRoute />,
  },
  {
    // SCR-17 Top 3 카드 — 10/T3 가 추천 연결과 함께 채운다.
    path: 'dating/cards',
    handle: { nav: 'dating' },
    loader: async () => {
      await requireDatingProfile();
      return null;
    },
    element: <Placeholder />,
  },
];
