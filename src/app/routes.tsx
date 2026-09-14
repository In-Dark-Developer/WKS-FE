import type { LoaderFunctionArgs, RouteObject } from 'react-router-dom';
import { Link, useLoaderData } from 'react-router-dom';

import { AppShell } from '@/app/AppShell';
import { requireMyResultId, requireSession } from '@/app/requireSession';
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
import { CompatibilityMapScreen, FriendRanking } from '@/features/friends';
import { IntroGate } from '@/features/intro';
import { ResultCard, ShareLinkButton } from '@/features/share';

// 세션 가드(T3·T8) 뒤에 결과 loader(T7)를 잇는다 — 이 브라우저가 만든 결과가 아니면 redirect('/')로 끝난다.
function protectedReadingLoader(args: LoaderFunctionArgs) {
  requireSession(args.params.id);
  return readingLoader(args);
}

// SCR-08 궁합 지도(05/T3) — 주소에 id 가 없어 보관된 '내 결과'로 결과 loader 를 다시 쓴다(친구 목록이 그 안에 있다).
function protectedMapLoader(args: LoaderFunctionArgs) {
  const resultId = requireMyResultId();
  return readingLoader({ ...args, params: { ...args.params, id: resultId } });
}

// renderCard(04/T7)·ranking(05)은 여기서 채우고, teaser(06) 슬롯은 그 Phase가 끝나기 전까지 비워 둔다 —
// saju 는 share·friends 를 import 하지 않으므로 조립은 app 이 한다(ARCHITECTURE Module Boundaries).
// '친구에게 공유'(04/T3)는 Figma 결과 화면(713:4078)대로 친구 궁합 순위가 비어 있을 때 안내 아래에만 둔다(PRD FR-4).
function ReadingResultRoute() {
  const view = useLoaderData<ReadingView>();
  const ranking = (
    <FriendRanking
      emptyAction={<ShareLinkButton nickname={view.nickname} shareId={view.shareId} size="m" />}
      friends={view.friends ?? []}
      headerAction={
        // Figma 798:3138 '지도 보기 >' — UI/14/600 Action/Teal/Default.
        <Link className="text-ui-14 font-semibold whitespace-nowrap text-primary-500" to="/me/map">
          지도 보기 &gt;
        </Link>
      }
      limit={3}
    />
  );
  return (
    <ReadingResult ranking={ranking} renderCard={(face) => <ResultCard {...face} />} view={view} />
  );
}

// SCR-08 궁합 지도 — 05/T2 CompatibilityMapScreen 에 결과 loader 의 친구 목록과 '친구에게 공유'(04/T3)를 잇는다.
function CompatibilityMapRoute() {
  const view = useLoaderData<ReadingView>();
  return (
    <CompatibilityMapScreen
      friends={view.friends ?? []}
      nickname={view.nickname}
      share={
        <ShareLinkButton
          className="w-full"
          label="친구에게 공유하고 궁합 지도 넓히기"
          nickname={view.nickname}
          shareId={view.shareId}
          variant="accent"
        />
      }
    />
  );
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
      // SCR-02 사주 입력 — 03/T4 SajuForm, action 03/T7. 첫 방문이면 SCR-01 인트로가 먼저 뜬다(FR-1).
      {
        index: true,
        element: (
          <IntroGate>
            <SajuForm />
          </IntroGate>
        ),
        action: sajuAction,
      },
      // SCR-04 사주 결과 — 03/T5 ReadingResult (세션 필요), loader 03/T7. 인연카드(SCR-05)는 이 화면에 합쳤다(04/T7).
      {
        path: 'reading/:id',
        loader: protectedReadingLoader,
        handle: { backdrop: 'result' },
        element: <ReadingResultRoute />,
        // 예약: 'pre-register' SCR-09 사전신청 모달 (06/T3, ReadingResult 의 <Outlet /> 에 뜬다, handle backdrop 'mist')
      },
      // 예약: 's/:shareId' SCR-06 공유 랜딩 (Phase 05)
      // SCR-08 궁합 지도 — 05/T2 CompatibilityMapScreen, 조립 05/T3. 결과 화면 순위의 '지도 보기'로 들어온다.
      {
        path: 'me/map',
        loader: protectedMapLoader,
        handle: { backdrop: 'result' },
        element: <CompatibilityMapRoute />,
      },
      // 예약: 'matching' SCR-10 소개팅 후보 (Phase 07, 세션 필요)
    ],
  },
];
