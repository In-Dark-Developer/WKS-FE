import { useState } from 'react';

import { AppShell } from '@/app/AppShell';
import { readAuthToken } from '@/api/authToken';
import { KakaoLoginButton, LogoutButton } from '@/features/auth';

// 개발 서버에서만 붙는다(App.tsx). 로그인 버튼 + 안내뿐인 더미 페이지 — 카카오 로그인 왕복을 눈으로
// 확인하기 위한 것이라 디자인이 없다. 진짜 소개팅 로그인 화면은 06-dating-gate Phase 에서 Figma 를
// 받아 새로 만든다(ADR-20260922-kakao-login-and-jwt-session).
export function KakaoLoginTestPage() {
  const [loggedIn, setLoggedIn] = useState(() => readAuthToken() !== null);

  return (
    <AppShell>
      <section className="flex flex-col items-center gap-24 px-16 pt-48 text-center">
        <h1 className="font-display text-display-24 text-primary">카카오 로그인 테스트</h1>
        <p className="text-ui-14 text-secondary">
          {loggedIn
            ? '로그인 상태입니다(로컬에 토큰 저장됨). 로그아웃은 이 토큰을 지울 뿐 서버에 알리지 않습니다 — 지우기 전 사본은 만료(15일)까지 유효합니다.'
            : '버튼을 누르면 카카오 로그인 화면으로 이동하고, 완료되면 이 origin 의 /dev/kakao-callback 으로 돌아옵니다. redirectUri 는 백엔드 app.auth.allowed-redirect-uris 와 카카오 콘솔에 정확히 같은 값으로 등록돼 있어야 합니다.'}
        </p>
        {loggedIn ? (
          <LogoutButton onLoggedOut={() => setLoggedIn(false)} />
        ) : (
          <KakaoLoginButton redirectPath="/dev/kakao-callback" />
        )}
      </section>
    </AppShell>
  );
}
