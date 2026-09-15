import type { LoaderFunctionArgs, RouteObject } from 'react-router-dom';
import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useNavigate,
  useRouteError,
} from 'react-router-dom';

import { AppShell } from '@/app/AppShell';
import { requireMyResultId, requireSession } from '@/app/requireSession';
import { RootLayout } from '@/app/RootLayout';
import { RouteError } from '@/app/RouteError';
import { RouteLoading } from '@/app/RouteLoading';
import {
  ReadingResult,
  SajuForm,
  createSajuAction,
  readingLoader,
  sajuAction,
  type ReadingView,
} from '@/features/saju';
import {
  CompatibilityMapScreen,
  FriendRanking,
  joinShareLoader,
  shareInputLoader,
  shareMapLoader,
  type ShareInputView,
  type SharedMapView,
} from '@/features/friends';
import { IntroGate } from '@/features/intro';
import { ResultCard, ShareLinkButton } from '@/features/share';
import angleSmallLeft from '@/ui/assets/icons/angle-small-left.svg';
import { Button } from '@/ui/Button';
import { Icon } from '@/ui/Icon';
import { ContentState } from '@/ui/state/ContentState';

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

// SCR-06 공유 링크 입력(Figma 720:3653) — 사주 입력 폼에 링크 주인 닉네임이 든 설명과 '운명 지도 확인하기'.
// 첫 방문이면 인트로가 먼저 뜬다(FR-1). 제출하면 결과를 만들고 궁합 생성(join)으로 간다 (05/T10, FR-6).
function ShareInputRoute() {
  const view = useLoaderData<ShareInputView>();
  return (
    <IntroGate>
      <SajuForm
        description={`아래 정보를 입력하고 나와 ${view.ownerNickname} 님의 귀인 궁합을 관계로 확인해보아요.`}
        submitLabel="운명 지도 확인하기"
      />
    </IntroGate>
  );
}

const shareSajuAction = createSajuAction(
  (_resultId, { params }) => `/s/${encodeURIComponent(params.shareId ?? '')}/join`,
);

// SCR-13 친구의 궁합 지도(Figma 720:3668) — 뒤로가기 + 방문자 궁합 지도(05/T5) + '내 사주 내용도 확인하기'.
// 뒤로가기는 브라우저 이전 페이지다: 입력에서 왔으면 입력, 링크로 바로 왔으면(입력을 건너뛴 redirect 는 기록이
// 남지 않는다) 채팅 앱 등 앱 밖 이전 페이지 (FR-6).
function SharedMapRoute() {
  const view = useLoaderData<SharedMapView>();
  const navigate = useNavigate();
  return (
    <CompatibilityMapScreen
      back={
        <button
          className="flex items-center gap-16 text-ui-16 font-medium text-on-brand"
          onClick={() => void navigate(-1)}
          type="button"
        >
          <Icon src={angleSmallLeft} />
          뒤로가기
        </button>
      }
      friends={view.friends}
      nickname={view.nickname}
      share={
        <Button
          className="w-full"
          onClick={() => void navigate(`/reading/${view.myResultId}`)}
          variant="apricot"
        >
          내 사주 내용도 확인하기
        </Button>
      }
      variant="visitor"
    />
  );
}

// 궁합 생성 실패 화면 — 없는 링크(404)는 공통 오류, 연결·서버 실패는 같은 주소로 다시 시도한다.
// 내 결과가 남아 있어 다시 시도해도 사주를 다시 입력하지 않는다 (FR-6).
function JoinShareError() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 404) return <RouteError />;
  return (
    <ContentState
      action={
        <Link className="text-ui-14 font-semibold text-brand underline" to=".">
          다시 시도하기
        </Link>
      }
      description="잠시 후 다시 시도해 주세요."
      state="error"
      title="인연을 잇지 못했어요"
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
      // SCR-06 공유 링크 입력 — 가드 없음(FR-18). 내 결과가 있으면 loader 가 join 으로 보낸다 (05/T10).
      {
        path: 's/:shareId',
        loader: shareInputLoader,
        action: shareSajuAction,
        element: <ShareInputRoute />,
      },
      // 궁합 생성 — 화면 없이 redirect 로만 끝난다(지도·입력·내 결과). 실패만 오류 화면을 그린다.
      {
        path: 's/:shareId/join',
        loader: joinShareLoader,
        handle: { backdrop: 'result' },
        errorElement: <JoinShareError />,
      },
      // SCR-13 친구의 궁합 지도 — 내 결과가 없으면 입력으로 (05/T10).
      {
        path: 's/:shareId/map',
        loader: shareMapLoader,
        handle: { backdrop: 'result' },
        element: <SharedMapRoute />,
      },
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
