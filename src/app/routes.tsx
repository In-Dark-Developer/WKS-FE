import type { LoaderFunctionArgs, RouteObject } from 'react-router-dom';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';

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
import { IntroGate } from '@/features/intro';
import { ConnectionCardScreen, ShareLinkButton, cardLoader, type CardView } from '@/features/share';
import { Button } from '@/ui/Button';

// 세션 가드(T3) 뒤에 결과 loader(T7)를 잇는다 — requireSession 이 없으면 redirect('/')로 끝난다.
function protectedReadingLoader(args: LoaderFunctionArgs) {
  requireSession();
  return readingLoader(args);
}

// 인연카드 화면도 결과와 같은 세션 가드 뒤에 둔다 — 남의 결과를 주소만으로 열지 못한다.
function protectedCardLoader(args: LoaderFunctionArgs) {
  requireSession();
  return cardLoader(args);
}

// 결과 화면(SCR-04)의 share 슬롯(04/T6) — 인연카드 화면 입구와 '친구에게 공유'(04/T3, FR-4).
// 입구는 Link 대신 Button+navigate 다: 디자인시스템 Button 은 <button> 이라 <a> 로 바꿀 수 없고,
// 여기서 클래스를 베껴 쓰면 ui 의 버튼 정의가 두 곳이 된다.
function ResultShare({ view }: { view: ReadingView }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8">
      <Button onClick={() => void navigate('card')} size="m" variant="accent">
        인연카드 보기
      </Button>
      <ShareLinkButton nickname={view.nickname} shareId={view.shareId} size="m" />
    </div>
  );
}

// teaser(06) 슬롯은 그 Phase가 끝나기 전까지 비워 둔다. share(04)·ranking(05)은 여기서 채운다 —
// saju 는 share·friends 를 import 하지 않으므로 조립은 app 이 한다(ARCHITECTURE Module
// Boundaries · 03/T5 Done-when "조립은 T7" · 04/T6 · 05/T2 커밋 메모).
function ReadingResultRoute() {
  const view = useLoaderData<ReadingView>();
  const ranking = <FriendRanking friends={view.compatibilities ?? []} limit={3} />;
  return <ReadingResult ranking={ranking} share={<ResultShare view={view} />} view={view} />;
}

// SCR-05 인연카드 — 04/T5 ConnectionCardScreen 위에 결과 화면으로 돌아가는 길을 얹는다.
function ConnectionCardRoute() {
  const view = useLoaderData<CardView>();

  return (
    <div className="flex flex-col">
      <ConnectionCardScreen {...view} />
      <Link
        className="self-center text-ui-14 font-semibold text-brand underline"
        relative="path"
        to=".."
      >
        결과로 돌아가기
      </Link>
    </div>
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
      // SCR-04 사주 결과 — 03/T5 ReadingResult (세션 필요), loader 03/T7
      {
        path: 'reading/:id',
        loader: protectedReadingLoader,
        handle: { backdrop: 'result' },
        element: <ReadingResultRoute />,
        // 예약: 'pre-register' SCR-09 사전신청 모달 (06/T3, ReadingResult 의 <Outlet /> 에 뜬다, handle backdrop 'mist')
      },
      // SCR-05 인연카드 — 04/T5 ConnectionCardScreen, loader 04/T6. reading/:id 의 자식이 아니라
      // 형제다: 카드 화면은 자기 <h1> 을 가진 전체 화면이라 결과 화면의 <Outlet /> 안에 넣으면
      // 결과 아래에 덧붙어 그려진다. 그 <Outlet /> 은 사전신청 모달(06/T3)이 쓴다.
      {
        path: 'reading/:id/card',
        loader: protectedCardLoader,
        handle: { backdrop: 'result' },
        element: <ConnectionCardRoute />,
      },
      // 예약: 's/:shareId' SCR-06 공유 랜딩 (Phase 05)
      // 예약: 'me/map' SCR-08 궁합 지도 (Phase 05, 세션 필요)
      // 예약: 'matching' SCR-10 소개팅 후보 (Phase 07, 세션 필요)
    ],
  },
];
