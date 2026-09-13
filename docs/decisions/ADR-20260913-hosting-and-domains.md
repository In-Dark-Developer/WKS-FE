# ADR-20260913: 프론트는 Netlify `threatoffate.site`, 백엔드는 `api.threatoffate.site`

- Status: Superseded by ADR-20260913-cloudflare-pages-hosting
- Date: 2026-09-13
- Deciders: @jjjung0921 (Phase 08 Lead) / 백엔드 팀 합의 필요 — PR 리뷰

## Context

SPA(Vite 빌드 산출물)를 정적 호스팅에 올려야 하고, ARCHITECTURE External Systems 의 '정적 호스팅'이 TBD 였다(Phase 08).
공유 링크 `/s/:shareId`(FR-4)는 인스타 스토리·카카오톡에 그대로 노출되고 미리보기(NFR-3)가 붙어야 한다.
백엔드 팀은 도메인 `threatoffate.site` 로 배포할 예정이다. 세션은 쿠키가 아니라 `Authorization` 헤더의 토큰이다(ADR-20260913-server-state-and-session-storage).

## Problem

프론트 호스팅 서비스와, 한 도메인 안에서 프론트·백엔드 주소를 어떻게 나누는가.

## Alternatives

1. 프론트 `app.threatoffate.site`, 백엔드 apex — 백엔드 배포를 바꾸지 않는다 / 공유 링크가 가장 자주 보이는 주소인데 길어진다
2. 프론트 apex `threatoffate.site`, 백엔드 `api.threatoffate.site` — 공유 링크가 가장 짧다 / 백엔드가 서브도메인으로 옮기고 CORS 에 프론트 origin 을 넣어야 한다
3. apex 하나에 Netlify 가 `/api/*` 를 백엔드로 프록시 — CORS 가 없다 / 모든 API 가 Netlify 를 거쳐 지연·요금·타임아웃 제약을 받는다

## Decision

대안 2 (소유자 결정, 2026-09-13).

- 프론트: Netlify, 운영 주소 `https://threatoffate.site` (`www.` 는 apex 로 301)
- 백엔드: `https://api.threatoffate.site` — 프론트 빌드의 `VITE_API_BASE_URL` 은 `https://api.threatoffate.site/api` (로컬과 같은 `/api` 접두 — 백엔드 확인 전 가정)
- SPA 라우팅: Netlify 에서 모든 경로를 `index.html` 로 되돌린다(`/* /index.html 200`) — 새로고침·공유 링크 직접 진입이 404 가 되지 않게

## Rationale

공유 링크가 제품의 유입 경로(US-2·US-3)라 짧고 기억하기 쉬운 apex 가 프론트에 가야 한다. 토큰이 헤더로 가므로 서브도메인 분리에 쿠키 도메인 문제가 없고, CORS 허용 origin 한 줄로 끝난다. 프록시(대안 3)는 축제 당일 트래픽을 Netlify 한 곳에 몰아 실패 지점을 늘린다.

## Consequences

- 긍정: 공유 링크 `https://threatoffate.site/s/:shareId`. 프론트·백엔드 배포가 서로 독립적이다.
- 부정 / 감수한 것: 백엔드가 `CORS_ALLOWED_ORIGINS` 에 `https://threatoffate.site` 를 넣어야 한다(Netlify 배포 미리보기 주소는 허용하지 않으면 미리보기에서 API 가 막힌다). DNS 는 apex 를 Netlify 로(ALIAS/ANAME 또는 Netlify DNS), `api` 를 백엔드로 나눠 건다.
- 미정: 공유 링크 미리보기(NFR-3) — SPA 라 크롤러가 `shareId` 별 OG 태그를 못 본다. Netlify Edge Function 이나 백엔드 렌더 중 무엇으로 할지는 Phase 08 계획에서 정한다. 사전신청 매직링크의 인증 완료 리다이렉트(PRD Q14 `verify-redirect-url`)는 `https://threatoffate.site` 아래 경로로 백엔드와 맞춘다.
- 후속 작업: ARCHITECTURE External Systems 갱신(이 PR), `docs/api/openapi.yaml` servers 에 운영 주소 추가(이 PR), Netlify 설정 파일·환경변수·도메인 연결은 Phase 08 Task.
