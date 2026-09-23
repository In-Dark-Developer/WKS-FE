import type { RouteObject } from 'react-router-dom';

import { Placeholder } from '@/app/Placeholder';

// 소개팅(Phase 10·11). 09/T1 은 하단 네비의 '소개팅' 탭이 갈 자리만 만든다 — 인트로 화면은 10/T4 가 퍼블리싱하고
// 10/T1 이 로그인·프로필 게이트와 함께 이 라우트에 붙인다. 가드가 없다: 사주 없이도 소개팅부터 볼 수 있다
// (기능명세서 1.3 — 로그인·프로필 조건은 소개팅 Flow 가 판단한다).
export const datingRoutes: RouteObject[] = [
  {
    path: 'dating',
    handle: { nav: 'dating' },
    element: <Placeholder />,
  },
];
