import { useState } from 'react';

import { Button } from '@/ui/Button';

import { buildKakaoAuthorizeUrl } from './kakaoAuthorizeUrl';

type Props = {
  // 카카오가 로그인 뒤 돌아올 경로. window.location.origin 과 합쳐 redirectUri 를 만든다 — 백엔드
  // app.auth.allowed-redirect-uris 화이트리스트에 이 origin+path 가 정확히 등록돼 있어야 한다.
  redirectPath: string;
  className?: string;
  // 테스트에서 주입한다 — jsdom 은 window.location 재정의를 막는다(진짜 페이지 이동이 일어난다고
  // 가정하기 때문). 기본값은 실제 전체 페이지 이동이다.
  navigate?: (url: string) => void;
};

const defaultNavigate = (url: string) => {
  window.location.href = url;
};

// 클릭하면 카카오 인가 화면으로 **전체 페이지 이동**한다(팝업이 아니다) — 카카오톡 인앱 브라우저 등에서도
// 그대로 동작해야 한다. 돌아오는 화면(redirectPath)이 code 를 받아 로그인을 마무리한다
// (features/auth/completeKakaoLogin, ADR-20260922-kakao-login-and-jwt-session).
export function KakaoLoginButton({ redirectPath, className, navigate = defaultNavigate }: Props) {
  const [pending, setPending] = useState(false);

  return (
    <Button
      className={className}
      loading={pending}
      loadingLabel="카카오로 이동 중"
      onClick={() => {
        setPending(true);
        try {
          const redirectUri = `${window.location.origin}${redirectPath}`;
          navigate(buildKakaoAuthorizeUrl(redirectUri));
        } catch (error) {
          // VITE_KAKAO_CLIENT_ID 미설정 등 — 원인은 콘솔에만 남긴다. 버튼을 다시 누를 수 있게 되돌린다.
          console.error('kakao login start failed', error);
          setPending(false);
        }
      }}
      type="button"
    >
      카카오로 로그인
    </Button>
  );
}
