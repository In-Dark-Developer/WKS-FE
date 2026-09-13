import type { RouteObject } from 'react-router-dom';

import { Placeholder } from '@/app/Placeholder';
import { requireSession } from '@/app/requireSession';
import { RouteError } from '@/app/RouteError';
import { RouteLoading } from '@/app/RouteLoading';

// 이 파일은 Phase 03 T3 이 단독으로 소유한다 — 각 화면은 컴포넌트·loader·action 만 export 하고 등록은 여기서 한다.
export const routes: RouteObject[] = [
  {
    path: '/',
    errorElement: <RouteError />,
    HydrateFallback: RouteLoading,
    children: [
      // SCR-02 사주 입력 — 03/T4 SajuForm
      { index: true, element: <Placeholder /> },
      // SCR-04 사주 결과 — 03/T5 ReadingResult (세션 필요)
      {
        path: 'reading/:id',
        loader: requireSession,
        element: <Placeholder />,
        // 예약: 'card' SCR-05 인연카드 (Phase 04) · 'pre-register' SCR-09 사전신청 모달 (06/T2)
      },
      // 예약: 's/:shareId' SCR-06 공유 랜딩 (Phase 05)
      // 예약: 'me/map' SCR-08 궁합 지도 (Phase 05, 세션 필요)
      // 예약: 'matching' SCR-10 소개팅 후보 (Phase 07, 세션 필요)
    ],
  },
];
