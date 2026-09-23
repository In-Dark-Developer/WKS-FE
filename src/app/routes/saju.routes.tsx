import type { LoaderFunctionArgs, RouteObject } from 'react-router-dom';
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom';

import { HomeScreen } from '@/app/screens/HomeScreen';
import { requireSaju } from '@/app/routes/guards';
import { fromSharedMapState } from '@/app/routes/fromSharedMap';
import { readingLoader, SajuForm, sajuAction, type ReadingView } from '@/features/saju';
import { IntroGate } from '@/features/intro';
import { PreRegisterModal, VerifyComplete, preRegisterAction } from '@/features/profile';
import { track } from '@/lib/analytics';

// 화면 도착 이벤트는 loader 에서 보낸다 — 이동마다 한 번이라 StrictMode 의 이중 마운트에 겹치지 않는다(analytics).

// 세션 가드(T3·T8) 뒤에 결과 loader(T7)를 잇는다 — 이 브라우저가 만든 결과가 아니면 redirect('/')로 끝난다.
async function protectedReadingLoader(args: LoaderFunctionArgs) {
  requireSaju(args.params.id);
  const view = await readingLoader(args);
  track('reading_viewed', { friendCount: view.friends?.length ?? 0 });
  return view;
}

// 친구의 궁합 지도에서 '내 사주 내용도 확인하기'로 들어왔을 때만(Figma 720:3587) 맨 위 '뒤로가기'가 그 지도로 돌아간다 —
// 지도가 이동 기록에 표시를 남기고 앞 페이지가 그 지도라 브라우저 이전 페이지로 간다(FR-6). 표시는 새로고침에도 남는다.
function HomeRoute() {
  const view = useLoaderData<ReadingView>();
  const navigate = useNavigate();
  const fromSharedMap = fromSharedMapState.safeParse(useLocation().state).success;
  return (
    <HomeScreen
      onBack={fromSharedMap ? () => void navigate(-1) : undefined}
      onPreRegister={() => {
        track('pre_register_opened', {});
        void navigate('pre-register');
      }}
      view={view}
    />
  );
}

// SCR-09 사전신청 모달 — 결과 화면 하위 라우트라 결과 화면의 <Outlet /> 에 뜬다(FR-9).
// 닫기(배경·ESC·완료의 '확인')는 부모 결과 화면으로 돌아간다.
function PreRegisterModalRoute() {
  const navigate = useNavigate();
  return <PreRegisterModal onClose={() => void navigate('..', { relative: 'path' })} open />;
}

// 사주 입력과 사주 결과(= 홈). 사전신청(SCR-09·SCR-14)은 결과 화면에 붙어 있어 같은 파일에 둔다.
export const sajuRoutes: RouteObject[] = [
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
  // SCR-04 사주 결과 = 홈 — 03/T5 ReadingResult (세션 필요), loader 03/T7. 인연카드(SCR-05)는 이 화면에 합쳤다(04/T7).
  {
    path: 'reading/:id',
    loader: protectedReadingLoader,
    // 공유 Flow 에서 '내 사주 내용도 확인하기'로 들어와도 여기서부터 네비가 보인다(FR-19, Figma 4.1.3).
    handle: { backdrop: 'result', nav: 'home' },
    element: <HomeRoute />,
    children: [
      {
        path: 'pre-register',
        action: preRegisterAction,
        handle: { backdrop: 'mist' },
        element: <PreRegisterModalRoute />,
      },
    ],
  },
  // SCR-14 인증 완료 — 백엔드 매직링크(`GET /signups/verify`)가 인증 뒤 302 로 보내는 자리다.
  // 가드 없음: 메일을 연 기기에 '내 결과'가 없을 수 있다.
  {
    path: 'verify',
    element: <VerifyComplete />,
  },
];
