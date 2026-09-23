import type { LoaderFunctionArgs } from 'react-router-dom';
import { Link, useLoaderData } from 'react-router-dom';

import { AppShell } from '@/app/AppShell';
import { completeKakaoLogin, type CompleteKakaoLoginResult } from '@/features/auth';
import { ContentState } from '@/ui/state/ContentState';

// 개발 서버에서만 붙는 라우트(App.tsx). 카카오가 돌려보내면 로그인을 마무리하고 결과를 그대로 보여준다
// — 디자인이 없다. loader 로 한다(useEffect 가 아니다) — StrictMode 는 effect 를 두 번 실행하는데,
// completeKakaoLogin 의 state 는 한 번 쓰면 지워지는 값이라 두 번째 호출이 항상 state-mismatch 로
// 실패한다. loader 는 라우터가 내비게이션마다 한 번만 부른다.
export async function kakaoCallbackLoader({
  request,
}: LoaderFunctionArgs): Promise<CompleteKakaoLoginResult> {
  const url = new URL(request.url);
  const redirectUri = `${url.origin}${url.pathname}`;
  return completeKakaoLogin(url.searchParams, redirectUri);
}

export function KakaoCallbackPage() {
  const result = useLoaderData<CompleteKakaoLoginResult>();
  return (
    <AppShell>
      <div className="flex flex-col items-center gap-24 px-16 pt-48">
        <CallbackContent result={result} />
        <Link className="text-ui-14 font-semibold text-brand underline" to="/dev/kakao">
          테스트 화면으로 돌아가기
        </Link>
      </div>
    </AppShell>
  );
}

function CallbackContent({ result }: { result: CompleteKakaoLoginResult }) {
  switch (result.kind) {
    case 'success':
      return (
        <ContentState
          description={`isNewUser=${String(result.data.isNewUser)}, restoredResultId=${
            result.data.restoredResultId ?? '없음'
          }. memberId 확인은 GET /api/me.`}
          state="empty"
          title="로그인 성공"
        />
      );
    case 'kakao-error':
      return (
        <ContentState description={result.error} state="error" title="카카오 로그인 취소·실패" />
      );
    case 'state-mismatch':
      return (
        <ContentState
          description="/dev/kakao 에서 다시 시작해 주세요. 이 페이지를 새로고침해도 나온다(재사용 방지)."
          state="error"
          title="state 불일치"
        />
      );
    case 'missing-code':
      return <ContentState description="code 파라미터가 없다." state="error" title="잘못된 콜백" />;
    case 'api-error':
      return (
        <ContentState
          description={
            result.error.kind === 'api'
              ? `${result.error.code}: ${result.error.message}`
              : result.error.kind
          }
          state="error"
          title="로그인 실패"
        />
      );
  }
}
