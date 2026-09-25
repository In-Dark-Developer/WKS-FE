import { Suspense } from 'react';
import type { LoaderFunctionArgs, RouteObject } from 'react-router-dom';
import {
  Await,
  Navigate,
  Outlet,
  useLoaderData,
  useNavigate,
  useParams,
  useRevalidator,
  useRouteLoaderData,
} from 'react-router-dom';

import { getMe } from '@/api/me';
import { MyMapScreen } from '@/app/screens/MyMapScreen';
import { requireMyResultId } from '@/app/routes/guards';
import { goToKakaoLogin } from '@/features/auth';
import {
  CompatibilityReasonSheet,
  ReasonAnswers,
  compatibilityReasonLoader,
  type ReasonLoaderData,
  type ReasonState,
} from '@/features/friends';
import { readingLoader, type ReadingView } from '@/features/saju';
import { track } from '@/lib/analytics';

type MyMapView = ReadingView & { myResultId: string; isSignedIn: boolean };

// SCR-08 궁합 지도(05/T3) — 주소에 id 가 없어 보관된 '내 결과'로 결과 loader 를 다시 쓴다(친구 목록이 그 안에 있다).
// 뒤로가기가 돌아갈 곳이 주소에 없으므로 그 resultId 를 화면에 함께 넘긴다.
// 로그인 여부(GET /me)로 저장 유도 카드를 정한다(FR-20) — 조회가 실패해도 지도는 그대로 보이고 비로그인으로 본다.
async function protectedMapLoader(args: LoaderFunctionArgs): Promise<MyMapView> {
  const resultId = requireMyResultId();
  const [view, me] = await Promise.all([
    readingLoader({ ...args, params: { ...args.params, id: resultId } }),
    getMe(),
  ]);
  track('map_viewed', { variant: 'own', friendCount: view.friends?.length ?? 0 });
  return { ...view, myResultId: resultId, isSignedIn: me.ok };
}

function CompatibilityMapRoute() {
  const view = useLoaderData<MyMapView>();
  const navigate = useNavigate();
  return (
    <>
      <MyMapScreen
        friends={view.friends ?? []}
        nickname={view.nickname}
        onBack={() => void navigate(`/reading/${view.myResultId}`)}
        onKakaoLogin={view.isSignedIn ? undefined : () => goToKakaoLogin('/me/map')}
        onSelectFriend={(friend) => {
          if (friend.compatibilityId !== undefined) void navigate(String(friend.compatibilityId));
        }}
        shareId={view.shareId}
      />
      {/* 궁합 이유 시트(`:friendId`)가 지도 위에 뜬다. */}
      <Outlet />
    </>
  );
}

// 세션이 없으면 지도처럼 입력으로 — 부모 loader 와 나란히 돌므로 여기서도 막아 이유를 부르지 않는다.
function protectedReasonLoader(args: LoaderFunctionArgs): ReasonLoaderData {
  requireMyResultId();
  return compatibilityReasonLoader(args);
}

// SCR-21 궁합 이유 상세(09/T4, FR-22) — 친구 줄·순위는 부모(지도) 데이터를 다시 쓰고, 이유만 기다린다.
function CompatibilityReasonRoute() {
  const map = useRouteLoaderData('my-map') as MyMapView | undefined;
  const { reason, compatibilityId } = useLoaderData<ReasonLoaderData>();
  const { friendId } = useParams();
  const navigate = useNavigate();
  const revalidator = useRevalidator();

  const friends = map?.friends ?? [];
  const index = friends.findIndex((friend) => friend.compatibilityId === compatibilityId);
  const friend = friends[index];
  // 목록에 없는 궁합 ID 로 들어오면 시트 없이 지도로 둔다.
  if (!friend) return <Navigate replace to="/me/map" />;

  const answers = (state: ReasonState) => (
    <ReasonAnswers onRetry={() => void revalidator.revalidate()} state={state} tier={friend.tier} />
  );

  // 시트는 한 번만 그리고 답 자리만 로딩 → 답(또는 오류)으로 바꾼다 — 바뀔 때 시트가 다시 뜨지 않는다.
  return (
    <CompatibilityReasonSheet
      friend={friend}
      key={friendId}
      onClose={() => void navigate('/me/map')}
      rank={index + 1}
    >
      <Suspense fallback={answers({ status: 'loading' })}>
        <Await errorElement={answers({ status: 'error' })} resolve={reason}>
          {(view: Awaited<ReasonLoaderData['reason']>) => answers({ status: 'ready', ...view })}
        </Await>
      </Suspense>
    </CompatibilityReasonSheet>
  );
}

export const mapRoutes: RouteObject[] = [
  // SCR-08 궁합 지도 — 05/T2 CompatibilityMapScreen, 조립 05/T3. 결과 화면 순위의 '지도 보기'로 들어온다.
  {
    id: 'my-map',
    path: 'me/map',
    loader: protectedMapLoader,
    handle: { backdrop: 'result', nav: 'map' },
    element: <CompatibilityMapRoute />,
    children: [
      {
        path: ':friendId',
        loader: protectedReasonLoader,
        element: <CompatibilityReasonRoute />,
      },
    ],
  },
];
