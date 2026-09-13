# ADR-20260913: 프론트 호스팅을 Netlify 에서 Cloudflare Pages 로 — 도메인 구성은 그대로

- Status: Superseded by ADR-20260913-workers-static-assets
- Date: 2026-09-13
- Deciders: @jjjung0921 (Phase 08 Lead) / 백엔드 팀 확인 필요 — PR 리뷰

## Context

ADR-20260913-hosting-and-domains 는 프론트를 Netlify `threatoffate.site`, 백엔드를 `api.threatoffate.site` 에 두기로 했다.
저장소 `In-Dark-Developer/WKS-FE` 는 GitHub 조직 소유 private 저장소인데, Netlify 는 조직 private 저장소 연결을 유료 플랜에서만 지원하고,
무료 플랜은 private 저장소에 계정 멤버가 아닌 사람의 커밋이 들어오면 빌드를 막는다('Unrecognized Git contributor'). 여러 팀원이 커밋하는 이 저장소는 무료로 배포할 수 없다.

## Problem

비용 없이 조직 private 저장소에서 `main` 병합마다 자동 배포하려면 어떤 정적 호스팅을 쓰는가. 이미 정한 도메인 구성은 유지할 수 있는가.

## Alternatives

1. Netlify Pro (월 $20) — 이전 ADR 그대로 / 축제 한 번을 위한 고정 비용
2. 개인 계정 fork 에서 Netlify 무료 배포 — 비용 없음 / 팀원 커밋이 여전히 미확인 기여자라 막힐 수 있고, fork 동기화·조직 권한·약관 문제가 남는다
3. 저장소를 public 으로 전환하고 Netlify 무료 — 기여자 과금 없음 / `.ai/`·기획 문서까지 공개된다
4. Cloudflare Pages 무료 — 조직 private 저장소 연결·사용자 수 무제한·월 500회 배포·트래픽 무제한 / 기본 도메인(apex)을 붙이려면 도메인 네임서버를 Cloudflare 로 옮겨야 한다

## Decision

대안 4 (소유자 결정, 2026-09-13). ADR-20260913-hosting-and-domains 를 대체한다.

- 프론트: Cloudflare Pages, 운영 주소 `https://threatoffate.site` (`www.` 는 apex 로 리다이렉트)
- 백엔드: `https://api.threatoffate.site` — 이전 ADR 과 같다. 프론트 빌드의 `VITE_API_BASE_URL` 은 `https://api.threatoffate.site/api` (`/api` 접두는 백엔드 확인 전 가정)
- DNS: `threatoffate.site` 의 네임서버를 Cloudflare 로 옮긴다. apex 는 Pages 프로젝트에, `api` 레코드는 백엔드 서버에 연결하고 **DNS only(프록시 끔)** 를 기본으로 한다
- SPA 라우팅: 산출물에 최상위 `404.html` 을 두지 않는다 — Pages 가 모르는 경로를 모두 `index.html` 로 응답한다(별도 리다이렉트 규칙 없음)
- 빌드 설정(Pages 대시보드): 빌드 명령 `pnpm build`, 출력 `dist`, 환경변수 `VITE_API_BASE_URL`·`PNPM_VERSION`. Node 버전은 `.nvmrc` 를 읽는다. 해시 자산 캐시는 `public/_headers`

## Rationale

비용 없이 팀 전원의 커밋을 배포할 수 있는 선택지 중 저장소를 공개하지 않는 것은 대안 4 뿐이다. 세션이 쿠키가 아니라 헤더 토큰이라 호스팅이 바뀌어도 백엔드·프론트 코드와 CORS 설계는 그대로다.
`api` 를 DNS only 로 두면 백엔드 요청이 Cloudflare 를 거치지 않아 백엔드 TLS·타임아웃 설정도 바뀌지 않는다.

## Consequences

- 긍정: 무료로 `main` 자동 배포와 PR 미리보기. 도메인·CORS·토큰·API 주소는 이전 결정 그대로.
- 부정 / 감수한 것: 네임서버 이전 — 기존 DNS 레코드(`api`, 메일을 쓰면 MX·TXT)를 Cloudflare 에 먼저 만들어야 전환 중 끊기지 않는다. Pages 빌드 이미지 기본 pnpm 이 10 이라 `PNPM_VERSION=11.22.0` 을 지정해야 한다(첫 배포 로그로 확인).
- 백엔드 팀 확인 목록:
  1. 네임서버 이전 일정과 `api.threatoffate.site` 레코드(A/CNAME) 값
  2. `api` 를 프록시로 켤 경우 — SSL 모드 Full (strict)·백엔드 인증서, 무료 플랜 요청 100초 제한(사주 생성 `POST /results` 응답 시간), 요청 100MB 제한. 켜지 않으면 해당 없음
  3. `CORS_ALLOWED_ORIGINS` 에 `https://threatoffate.site` (PR 미리보기에서도 API 를 쓰려면 `https://*.<프로젝트>.pages.dev`)
  4. 운영 경로의 `/api` 접두, 사전신청 인증 완료 리다이렉트(`verify-redirect-url`)를 `https://threatoffate.site` 아래로
- 미정: 공유 링크 `shareId` 별 미리보기(NFR-3) — Pages Functions 와 백엔드 렌더 중 선택은 Phase 08 T4.
- 후속 작업: ARCHITECTURE External Systems·openapi servers 참조 갱신(이 PR), Phase 08 PLAN T2·T3 과 `public/_headers`(계획 PR #66 수정).
