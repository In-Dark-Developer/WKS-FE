# Phase 08 — launch-readiness

- Status: PLANNED
- Lead: @jjjung0921
- Depends on: 05, 07
- Start: 2026-09-13 · End: 2026-09-17 (MVP 마감 — PRD Constraints) · 실기기 검증 2026-09-18 ~ 09-28

## Goal

축제 현장에서 쓸 수 있도록 `https://threadoffate.site` 에 자동 배포되고, 공유 링크가 미리보기와 함께 열리며, 모바일 성능·접근성·브라우저 지원 기준(NFR-1·2·3·5·6)을 실기기에서 확인한 상태.

## Motivation

축제는 2026-09-29 하루에 트래픽이 몰리고 되돌릴 시간이 없다. 배포 경로(ADR-20260914-netlify-personal-fork)를 기능 개발과 함께 먼저 열어 두면 9-17 이전부터 매 병합이 실제 주소에서 확인되고, 9-18 ~ 9-28 실기기 검증 기간을 온전히 쓸 수 있다. 공유 링크가 유입의 전부라(US-2·US-3) 미리보기(NFR-3)도 여기서 닫는다.

## Scope

- 배포 설정 — 개인 fork + Netlify 무료: `netlify.toml`(빌드·SPA 폴백·캐시·운영 API 주소), 병합마다 fork 동기화 워크플로우 (`docs/deploy/netlify-fork.md`)
- 운영 연결 — fork 동기화 토큰·변수 등록, Netlify 도메인 추가, Route53 A·CNAME, 백엔드 CORS 확인 (사람 작업)
- 공유 링크 미리보기 — 기본 OG 메타·썸네일, `shareId` 별 동적 미리보기 방식 결정 (NFR-3, SC-6)
- 성능 예산 — 초기 JS·폰트 전송량과 LCP 측정 도구·절차 (NFR-2, SC-2)
- 출시 점검 — 360·390·430px 가로 스크롤, 라벨·대비·키보드, iOS Safari·Android Chrome 실기기로 SC-1~6 (NFR-1·5·6)

## Out of Scope

- 기능 화면·연동 — Phase 03~07
- 사전신청 인증 완료 리다이렉트 페이지 — 백엔드 계약(PRD Q14 `verify-redirect-url`) 확정 뒤 06 에서 경로를 정한다(06 PLAN 은 08 로 넘겼다 — 경로만 이 Phase 가 `threadoffate.site` 아래로 맞춘다)
- 분석·로깅 도구 — ARCHITECTURE 관측성 TBD. 도입하려면 ADR 이 먼저다(아래 Dependencies)

## Dependencies

**준비됨**

- ADR-20260914-netlify-personal-fork — 프론트 Netlify(개인 fork `jjjung0921/WKS-FE`), DNS Route53, 백엔드 `api.threadoffate.site` (aws-cloudfront-hosting 대체)
- 현재 빌드(2026-09-13): 초기 JS 130KB gzip(예산 250KB 안), CSS 23KB gzip, 폰트 동국체 434KB·성곡체 205KB(첫 화면 LCP 에 영향 — T5 에서 측정)

**사람·다른 팀이 해야 하는 것**

- fork·Netlify — fork `jjjung0921/WKS-FE` 와 Netlify 사이트 연결됨(2026-09-14). 소유자가 fine-grained PAT → 조직 저장소 Secret `FORK_SYNC_TOKEN`·Variable `NETLIFY_FORK_REPO` 등록(`docs/deploy/netlify-fork.md` 2). `main` 병합은 fork 소유자가 한다(Netlify 무료 플랜 빌드 차단 회피)
- DNS·정리 — Route53 apex A `75.2.60.5`·`www` CNAME `<사이트>.netlify.app`(백엔드 팀), Cloudflare Workers `wks-fe` Git 연결 해제
- 백엔드 — `CORS_ALLOWED_ORIGINS` 에 `https://threadoffate.site`·`https://www.threadoffate.site`, 운영 경로의 `/api` 접두 확인
- OG 썸네일 이미지(1200×630) — 디자인에 없다. 없으면 인연카드 앞면 캡처로 대신한다
- 분석 도구 도입 여부 — 기획 결정. 도입하면 ADR + 개인정보 고지(FR-17) 갱신

## Tasks

- [x] T1. 상세 계획 작성 — Done when: 이 PLAN의 Scope·Tasks·Acceptance Criteria가 채워지고 병합됨 · Touches: `docs/phases/08-launch-readiness/` · Owner: @jjjung0921

- [x] T2. 배포 설정 — Done when: `netlify.toml`(빌드·`dist`·운영 `VITE_API_BASE_URL`·`/* → /index.html 200`·자산 캐시)과 조직 저장소 `main` push 마다 개인 fork `main` 을 upstream `main` 으로 덮어쓰는(push, fork 전용 fine-grained 토큰) `.github/workflows/sync-fork.yml`(변수·토큰이 없으면 건너뜀, fork 안에서는 안 돎)이 병합되고, 설정 절차가 `docs/deploy/netlify-fork.md` 에 있으며, AWS 배포 워크플로우·문서가 빠진다 · Touches: `netlify.toml`, `.github/workflows/`, `docs/deploy/` · Owner: @jjjung0921 (commit b565104·cc060d8 — 호스팅 Netlify → Pages → Workers → AWS → 개인 fork Netlify, ADR-20260914-netlify-personal-fork)

- [x] T3. 운영 연결 확인 — Done when: `docs/deploy/netlify-fork.md` 2~3 이 끝나 `sync-fork` 실행 뒤 Netlify 에 새 배포가 생기고, `https://threadoffate.site`·`www` 가 HTTPS 로 열리며, `https://threadoffate.site/s/test` 새로고침이 앱을 열고, 운영 화면에서 `api.threadoffate.site` 호출이 CORS 오류 없이 간다 — 확인 결과를 RESULT 에 적는다 · Touches: `docs/phases/08-launch-readiness/` · After: T2 · Owner: @jjjung0921 (commit 311f0b1, de7666f — PR #77)

- [ ] T4. 공유 링크 미리보기 — Done when: `index.html` 에 서비스 공통 OG·Twitter 메타(제목·설명·썸네일·`og:url`)와 썸네일 이미지가 있어 카카오톡·인스타·메신저에 `https://threadoffate.site/s/<id>` 를 붙이면 제목·설명·썸네일이 보이고(SC-6), `shareId` 별 동적 미리보기(Netlify Edge Functions vs 백엔드 렌더)는 ADR 로 채택·기각이 남는다 · Touches: `index.html`, `public/og/`, `docs/decisions/` · After: T3 · Owner: @jjjung0921

- [ ] T5. 성능 예산 측정 — Done when: 운영 주소를 Lighthouse 모바일(느린 4G) 3회 측정한 LCP 중앙값 < 2.5s 와 초기 JS < 250KB gzip 이 RESULT 에 기록되고, 넘으면 원인(폰트·이미지·번들)을 줄이는 변경이 병합되며, 빌드 산출물의 JS gzip 크기를 CI 가 검사해 250KB 를 넘으면 실패한다 (NFR-2) · Touches: `scripts/check-bundle-size.mjs`, `.github/workflows/ci.yml`, `package.json` · After: T3 · Owner: @jjjung0921

- [ ] T6. 출시 점검 — Done when: iOS Safari·Android Chrome 실기기 각 1대에서 SC-1~6 절차와 360·390·430px 가로 스크롤 0·키보드 폼 완주·본문 대비 4.5:1 을 확인해 결과·발견한 문제(이슈 번호)를 RESULT 에 남긴다 (NFR-1·5·6) · Touches: `docs/phases/08-launch-readiness/` · After: T3, T4 · Owner: @jjjung0921

<!-- T2 는 소유자 지시(2026-09-13 "Phase 08 계획이랑 같이 올려줘")로 계획 PR 에 함께 들어갔다. 호스팅이 Netlify → Cloudflare Pages → Workers → AWS S3 + CloudFront → 개인 fork + Netlify 무료(ADR-20260914-netlify-personal-fork)로 바뀌며 재작업됐다. T3·T6 은 사람이 계정·실기기로 확인하는 Task 라 코드 Touches 가 없다.
     T5 의 CI 검사는 `.github/workflows/ci.yml` 을 고친다 — 병합 전 Lead 리뷰. Depends on 05·07 은 T6(SC-3~5)만 해당하고 T2~T5 는 지금 시작할 수 있다. -->

## Relevant Specifications

- `docs/PRD.md` — NFR-1, NFR-2, NFR-3, NFR-5, NFR-6, Success Criteria SC-1~6, Constraints(일정)
- `docs/decisions/ADR-20260914-netlify-personal-fork.md` · `docs/deploy/netlify-fork.md`
- `docs/ARCHITECTURE.md` — External Systems(정적 호스팅·백엔드), Cross-cutting Concerns(설정)
- `docs/api/openapi.yaml` — servers(운영)

## Acceptance Criteria

- [ ] AC1. `main` 병합이 사람 손 없이 fork 동기화·Netlify 로 `https://threadoffate.site` 에 배포되고, 공유 링크 직접 진입·새로고침이 앱을 연다
- [ ] AC2. 운영 화면에서 백엔드 호출이 CORS 오류 없이 성공한다
- [ ] AC3. 공유 링크를 카카오·인스타·메신저에 붙이면 제목·설명·썸네일이 보인다 (NFR-3, SC-6)
- [ ] AC4. 모바일 느린 4G 에서 LCP < 2.5s, 초기 JS < 250KB gzip 이고 CI 가 JS 크기를 지킨다 (NFR-2)
- [ ] AC5. 실기기 iOS Safari·Android Chrome 에서 SC-1~6 과 NFR-1·5·6 확인 결과가 RESULT 에 있다

## Validation Plan

- AC1: 이 PLAN 병합 뒤 Netlify 배포 목록의 커밋 SHA 가 upstream main 과 같은지 확인, `/s/test` 새로고침 · T3
- AC2: 운영 화면 DevTools Network 에서 `api.threadoffate.site` 응답과 CORS 헤더 확인 · T3
- AC3: 카카오톡 공유 디버거(developers.kakao.com)·메신저 붙여넣기 스크린샷 · T4
- AC4: Lighthouse 모바일 3회 중앙값, CI 크기 검사 로그 · T5
- AC5: 기기별 체크리스트를 RESULT 에 표로 · T6
