import type { LoaderFunctionArgs, RouteObject } from 'react-router-dom';
import { useLoaderData, useNavigate } from 'react-router-dom';

import { MyMapScreen } from '@/app/screens/MyMapScreen';
import { requireMyResultId } from '@/app/routes/guards';
import { readingLoader, type ReadingView } from '@/features/saju';
import { track } from '@/lib/analytics';

type MyMapView = ReadingView & { myResultId: string };

// SCR-08 궁합 지도(05/T3) — 주소에 id 가 없어 보관된 '내 결과'로 결과 loader 를 다시 쓴다(친구 목록이 그 안에 있다).
// 뒤로가기가 돌아갈 곳이 주소에 없으므로 그 resultId 를 화면에 함께 넘긴다.
async function protectedMapLoader(args: LoaderFunctionArgs): Promise<MyMapView> {
  const resultId = requireMyResultId();
  const view = await readingLoader({ ...args, params: { ...args.params, id: resultId } });
  track('map_viewed', { variant: 'own', friendCount: view.friends?.length ?? 0 });
  return { ...view, myResultId: resultId };
}

function CompatibilityMapRoute() {
  const view = useLoaderData<MyMapView>();
  const navigate = useNavigate();
  return (
    <MyMapScreen
      friends={view.friends ?? []}
      nickname={view.nickname}
      onBack={() => void navigate(`/reading/${view.myResultId}`)}
      shareId={view.shareId}
    />
  );
}

export const mapRoutes: RouteObject[] = [
  // SCR-08 궁합 지도 — 05/T2 CompatibilityMapScreen, 조립 05/T3. 결과 화면 순위의 '지도 보기'로 들어온다.
  {
    path: 'me/map',
    loader: protectedMapLoader,
    handle: { backdrop: 'result', nav: 'map' },
    element: <CompatibilityMapRoute />,
  },
];
