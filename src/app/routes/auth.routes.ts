import type { RouteObject } from 'react-router-dom';
import { redirect } from 'react-router-dom';

import { completeKakaoLogin, KAKAO_CALLBACK_PATH } from '@/features/auth';

// 카카오 로그인 콜백 — 인가 코드를 백엔드에 넘기고(세션 쿠키가 심긴다) 로그인을 시작한 화면으로 돌아간다.
// loader 로 한다: state 는 한 번 쓰면 지워지므로 StrictMode 의 effect 이중 실행이면 두 번째가 항상 실패한다.
// 취소·실패해도 같은 화면으로 돌아가고 비로그인 기록은 남는다(FR-21) — 원인은 콘솔에만 남긴다.
async function kakaoCallbackLoader({ request }: { request: Request }) {
  const { returnTo, outcome } = await completeKakaoLogin(new URL(request.url).searchParams);
  if (outcome.kind !== 'success') console.error('카카오 로그인 실패', outcome);
  return redirect(returnTo);
}

export const authRoutes: RouteObject[] = [
  {
    path: KAKAO_CALLBACK_PATH.slice(1),
    loader: kakaoCallbackLoader,
    element: null,
  },
];
