import type { LoaderFunctionArgs, RouteObject } from 'react-router-dom';
import { useLoaderData } from 'react-router-dom';

import { AppShell } from '@/app/AppShell';
import { requireSession } from '@/app/requireSession';
import { RootLayout } from '@/app/RootLayout';
import { RouteError } from '@/app/RouteError';
import { RouteLoading } from '@/app/RouteLoading';
import {
  ReadingResult,
  SajuForm,
  readingLoader,
  sajuAction,
  type ReadingView,
} from '@/features/saju';
import { FriendRanking } from '@/features/friends';

// 세션 가드(T3) 뒤에 결과 loader(T7)를 잇는다 — requireSession 이 없으면 redirect('/')로 끝난다.
function protectedReadingLoader(args: LoaderFunctionArgs) {
  requireSession();
  return readingLoader(args);
}

// share(04)·teaser(06) 슬롯은 그 Phase가 끝나기 전까지 비워 둔다. ranking(05)은 FriendRanking으로
// 채운다 — saju 는 friends 를 import 하지 않으므로 조립은 여기(app)서 한다(ARCHITECTURE Module
// Boundaries · 03/T5 Done-when "조립은 T7" · 05/T2 커밋 메모).
function ReadingResultRoute() {
  const view = useLoaderData<ReadingView>();
  const ranking = <FriendRanking friends={view.compatibilities ?? []} limit={3} />;
  return <ReadingResult ranking={ranking} view={view} />;
}

// 이 파일은 Phase 03 T7 이 단독으로 소유한다(T3 이후 인계) — 각 화면은 컴포넌트·loader·action 만
// export 하고 등록은 여기서 한다. 배경은 handle.backdrop 으로 정한다 — 'dawn'(기본) · 'result'(사주 결과) ·
// 'mist'(사전신청 모달).
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
    children: [
      // SCR-02 사주 입력 — 03/T4 SajuForm, action 03/T7
      { index: true, element: <SajuForm />, action: sajuAction },
      // SCR-04 사주 결과 — 03/T5 ReadingResult (세션 필요), loader 03/T7
      {
        path: 'reading/:id',
        loader: protectedReadingLoader,
        handle: { backdrop: 'result' },
        element: <ReadingResultRoute />,
        // 예약: 'card' SCR-05 인연카드 (Phase 04) · 'pre-register' SCR-09 사전신청 모달 (06/T2, handle backdrop 'mist')
      },
      // 예약: 's/:shareId' SCR-06 공유 랜딩 (Phase 05)
      // 예약: 'me/map' SCR-08 궁합 지도 (Phase 05, 세션 필요)
      // 예약: 'matching' SCR-10 소개팅 후보 (Phase 07, 세션 필요)
    ],
  },
];
