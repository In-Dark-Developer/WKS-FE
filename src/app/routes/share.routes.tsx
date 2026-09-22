import type { LoaderFunctionArgs, RouteObject } from 'react-router-dom';
import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useNavigate,
  useRouteError,
} from 'react-router-dom';
import type { z } from 'zod';

import { AppShell } from '@/app/AppShell';
import { RouteError } from '@/app/RouteError';
import { RouteLoading } from '@/app/RouteLoading';
import { fromSharedMapState } from '@/app/routes/fromSharedMap';
import { ShareInputScreen } from '@/app/screens/ShareInputScreen';
import { SharedMapScreen } from '@/app/screens/SharedMapScreen';
import { readSession } from '@/api/session';
import {
  joinShare,
  joinShareLoader,
  ShareJoinLoading,
  shareInputLoader,
  shareMapLoader,
  type ShareInputView,
  type SharedMapView,
} from '@/features/friends';
import { IntroGate } from '@/features/intro';
import { createSajuAction } from '@/features/saju';
import { track } from '@/lib/analytics';
import { ContentState } from '@/ui/state/ContentState';

// SCR-13 친구의 궁합 지도 — 방문자 지도 도착.
async function trackedShareMapLoader(args: LoaderFunctionArgs) {
  const view = await shareMapLoader(args);
  track('map_viewed', { variant: 'visitor', friendCount: view.friends.length });
  return view;
}

// 첫 방문이면 인트로가 먼저 뜬다(FR-1). 제출하면 결과·궁합을 만들고 친구의 궁합 지도로 간다 (05/T10, FR-6).
function ShareInputRoute() {
  const view = useLoaderData<ShareInputView>();
  return (
    <IntroGate>
      <ShareInputScreen ownerNickname={view.ownerNickname} />
    </IntroGate>
  );
}

// 결과를 만든 요청에서 궁합까지 만들고 지도로 간다 — 입력 → 지도 한 번의 이동이라 뒤로가기가 입력으로 온다.
// 궁합이 연결 문제로 실패하면 재시도 주소(join)로 간다.
const shareSajuAction = createSajuAction(async (resultId, { params }) => {
  const shareId = params.shareId ?? '';
  return (await joinShare(shareId, resultId)) ?? `/s/${encodeURIComponent(shareId)}/join`;
}, 'share');

// 내 사주로는 push 로 가서 내 사주의 '뒤로가기'가 이 지도로 돌아온다 (FR-6).
function SharedMapRoute() {
  const view = useLoaderData<SharedMapView>();
  const navigate = useNavigate();
  return (
    <SharedMapScreen
      friends={view.friends}
      nickname={view.nickname}
      onViewMyReading={() =>
        void navigate(`/reading/${view.myResultId}`, {
          state: { from: 'shared-map' } satisfies z.infer<typeof fromSharedMapState>,
        })
      }
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

// 공유 링크 세 주소(입력·재시도·지도)의 첫 진입 대기 화면 — AppShell 은 RootLayout 이 그리지 못하므로
// (hydrate 중에는 부모 element 가 없다) 여기서 감싼다.
// 이 브라우저에 내 결과가 있을 때만 궁합을 만드느라 기다린다 — 처음 온 방문자는 곧바로 사주 입력이라
// '이전 정보로 …' 문구가 맞지 않아 공통 로딩만 보인다(보관값은 localStorage 라 이 시점에 바로 읽힌다).
// 대기 화면을 보는 사람에게는 궁합이 금방 만들어져도 최소 3초는 보여 준다(소유자 요청 2026-09-17, 1.5초에서 늘림) —
// 화면이 번쩍이고 지나가면 무슨 일이 일어났는지 알 수 없다. 결과가 없어 이 화면을 보지 않는 첫 방문자는
// 기다리지 않는다(아래 ShareEntryFallback 과 같은 기준).
const SHARE_LOADING_MIN_MS = 3000;

function shareEntryLoader<TArgs extends LoaderFunctionArgs, TResult>(
  loader: (args: TArgs) => Promise<TResult>,
) {
  return async (args: TArgs): Promise<TResult> => {
    const startedAt = Date.now();
    const showsLoading = readSession() !== null;
    try {
      return await loader(args);
    } finally {
      // loader 가 redirect 를 던져도(공유 링크의 정상 경로다) 이 기다림을 거친 뒤 던져진다.
      const left = SHARE_LOADING_MIN_MS - (Date.now() - startedAt);
      if (showsLoading && left > 0) await new Promise((resolve) => setTimeout(resolve, left));
    }
  };
}

function ShareEntryFallback() {
  return readSession() ? (
    <AppShell backdrop="result">
      <ShareJoinLoading />
    </AppShell>
  ) : (
    <AppShell>
      <RouteLoading />
    </AppShell>
  );
}

export const shareRoutes: RouteObject[] = [
  // SCR-06 공유 링크 입력 — 가드 없음(FR-18). 내 결과가 있으면 loader 가 join 으로 보낸다 (05/T10).
  {
    path: 's/:shareId',
    loader: shareEntryLoader(shareInputLoader),
    action: shareSajuAction,
    handle: { backdrop: 'result' },
    // 링크를 누른 첫 진입은 loader 가 끝날 때까지 이 화면이다(내 결과가 있으면 그대로 궁합을 만든다).
    hydrateFallbackElement: <ShareEntryFallback />,
    element: <ShareInputRoute />,
  },
  // 궁합 재시도 — 화면 없이 이동으로만 끝난다(지도·입력·내 결과). 실패만 '다시 시도하기' 오류를 그린다.
  {
    path: 's/:shareId/join',
    loader: shareEntryLoader(joinShareLoader),
    handle: { backdrop: 'result' },
    hydrateFallbackElement: <ShareEntryFallback />,
    errorElement: <JoinShareError />,
  },
  // SCR-13 친구의 궁합 지도 — 내 결과가 없으면 입력으로 (05/T10).
  {
    path: 's/:shareId/map',
    loader: trackedShareMapLoader,
    handle: { backdrop: 'result' },
    hydrateFallbackElement: <ShareEntryFallback />,
    element: <SharedMapRoute />,
  },
];
