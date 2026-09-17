/// <reference types="vite/client" />
// ↑ CSS·에셋 import 의 타입(Vite 가 번들한다).
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/app/App';
import { initAnalytics } from '@/lib/analytics';
import { kakaoTalkExternalUrl } from '@/lib/inAppBrowser';

import './index.css';

// 카카오톡 인앱이면 결과를 만들기 전에 기본 브라우저로 넘긴다. 스킴을 모르는 구버전이면 이동이 없으므로 앱은 그대로 띄운다.
const externalUrl = kakaoTalkExternalUrl(navigator.userAgent, window.location.href);
if (externalUrl) window.location.href = externalUrl;

// 제품 분석 — 화면이 뜨기 전에 켜야 첫 페이지뷰·유입 경로를 놓치지 않는다.
initAnalytics();

// index.html 이 항상 #root 를 갖는다 — 없으면 앱이 뜰 수 없으므로 여기서 단언한다.
const container = document.getElementById('root')!;

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
