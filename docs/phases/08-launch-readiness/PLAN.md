# Phase 08 — launch-readiness

- Status: PLANNED
- Lead: @jjjung0921
- Depends on: 05, 07
- Start: 2026-09-13 · End: 2026-09-17 (MVP 마감 — PRD Constraints) · 실기기 검증 2026-09-18 ~ 09-28

## Goal

축제 현장에서 쓸 수 있도록 `https://threatoffate.site` 에 자동 배포되고, 공유 링크가 미리보기와 함께 열리며, 모바일 성능·접근성·브라우저 지원 기준(NFR-1·2·3·5·6)을 실기기에서 확인한 상태.

## Motivation

축제는 2026-09-29 하루에 트래픽이 몰리고 되돌릴 시간이 없다. 배포 경로(ADR-20260913-hosting-and-domains)를 기능 개발과 함께 먼저 열어 두면 9-17 이전부터 매 병합이 실제 주소에서 확인되고, 9-18 ~ 9-28 실기기 검증 기간을 온전히 쓸 수 있다. 공유 링크가 유입의 전부라(US-2·US-3) 미리보기(NFR-3)도 여기서 닫는다.

## Scope

- Netlify 배포 설정 — 빌드·SPA 폴백·자산 캐시·운영 API 주소 (`netlify.toml`)
- 운영 연결 — Netlify 사이트 연결, `threatoffate.site` DNS·HTTPS, 백엔드 CORS 확인 (사람 작업)
- 공유 링크 미리보기 — 기본 OG 메타·썸네일, `shareId` 별 동적 미리보기 방식 결정 (NFR-3, SC-6)
- 성능 예산 — 초기 JS·폰트 전송량과 LCP 측정 도구·절차 (NFR-2, SC-2)
- 출시 점검 — 360·390·430px 가로 스크롤, 라벨·대비·키보드, iOS Safari·Android Chrome 실기기로 SC-1~6 (NFR-1·5·6)

## Out of Scope

- 기능 화면·연동 — Phase 03~07
- 사전신청 인증 완료 리다이렉트 페이지 — 백엔드 계약(PRD Q14 `verify-redirect-url`) 확정 뒤 06 에서 경로를 정한다(06 PLAN 은 08 로 넘겼다 — 경로만 이 Phase 가 `threatoffate.site` 아래로 맞춘다)
- 분석·로깅 도구 — ARCHITECTURE 관측성 TBD. 도입하려면 ADR 이 먼저다(아래 Dependencies)

## Dependencies

**준비됨**

- ADR-20260913-hosting-and-domains — 프론트 Netlify `threatoffate.site`, 백엔드 `api.threatoffate.site` (병합됨, PR #65)
- 현재 빌드(2026-09-13): 초기 JS 130KB gzip(예산 250KB 안), CSS 23KB gzip, 폰트 동국체 434KB·성곡체 205KB(첫 화면 LCP 에 영향 — T5 에서 측정)

**사람·다른 팀이 해야 하는 것**

- Netlify 계정·사이트 연결 — GitHub 조직 `In-Dark-Developer` 에 Netlify 앱 설치(조직 관리자 권한) 후 `WKS-FE` import. 연결 뒤에는 `main` 병합마다 자동 배포, PR 마다 배포 미리보기
- DNS — apex `threatoffate.site` 를 Netlify 로(ALIAS/ANAME 또는 Netlify DNS), `api` 를 백엔드로
- 백엔드 — `CORS_ALLOWED_ORIGINS` 에 `https://threatoffate.site`(배포 미리보기를 쓰려면 그 주소도), 운영 경로의 `/api` 접두 확인
- OG 썸네일 이미지(1200×630) — 디자인에 없다. 없으면 인연카드 앞면 캡처로 대신한다
- 분석 도구 도입 여부 — 기획 결정. 도입하면 ADR + 개인정보 고지(FR-17) 갱신

## Tasks

- [x] T1. 상세 계획 작성 — Done when: 이 PLAN의 Scope·Tasks·Acceptance Criteria가 채워지고 병합됨 · Touches: `docs/phases/08-launch-readiness/` · Owner: @jjjung0921

- [x] T2. Netlify 배포 설정 — Done when: `netlify.toml` 이 빌드 명령(`pnpm build`)·산출물(`dist`)·운영 `VITE_API_BASE_URL`·SPA 폴백(`/* → /index.html 200`)·해시 자산 장기 캐시를 담아 병합되어, 사이트를 연결하면 Netlify 화면에서 더 설정할 것이 없다 · Touches: `netlify.toml` · Owner: @jjjung0921 (commit 44b4407 — 소유자 요청으로 T1 계획 PR 에 함께)

- [ ] T3. 운영 연결 확인 — Done when: Netlify 사이트가 `WKS-FE` 에 연결되고 `https://threatoffate.site` 가 HTTPS 로 열리며, `https://threatoffate.site/s/test` 새로고침이 404 가 아니고, 운영 화면에서 `api.threatoffate.site` 호출이 CORS 오류 없이 가며, `www.` 가 apex 로 넘어간다 — 확인 결과를 RESULT 에 적는다 · Touches: `docs/phases/08-launch-readiness/` · After: T2 · Owner: @jjjung0921

- [ ] T4. 공유 링크 미리보기 — Done when: `index.html` 에 서비스 공통 OG·Twitter 메타(제목·설명·썸네일·`og:url`)와 썸네일 이미지가 있어 카카오톡·인스타·메신저에 `https://threatoffate.site/s/<id>` 를 붙이면 제목·설명·썸네일이 보이고(SC-6), `shareId` 별 동적 미리보기(Netlify Edge Function vs 백엔드 렌더)는 ADR 로 채택·기각이 남는다 · Touches: `index.html`, `public/og/`, `docs/decisions/` · After: T3 · Owner: @jjjung0921

- [ ] T5. 성능 예산 측정 — Done when: 운영 주소를 Lighthouse 모바일(느린 4G) 3회 측정한 LCP 중앙값 < 2.5s 와 초기 JS < 250KB gzip 이 RESULT 에 기록되고, 넘으면 원인(폰트·이미지·번들)을 줄이는 변경이 병합되며, 빌드 산출물의 JS gzip 크기를 CI 가 검사해 250KB 를 넘으면 실패한다 (NFR-2) · Touches: `scripts/check-bundle-size.mjs`, `.github/workflows/ci.yml`, `package.json` · After: T3 · Owner: @jjjung0921

- [ ] T6. 출시 점검 — Done when: iOS Safari·Android Chrome 실기기 각 1대에서 SC-1~6 절차와 360·390·430px 가로 스크롤 0·키보드 폼 완주·본문 대비 4.5:1 을 확인해 결과·발견한 문제(이슈 번호)를 RESULT 에 남긴다 (NFR-1·5·6) · Touches: `docs/phases/08-launch-readiness/` · After: T3, T4 · Owner: @jjjung0921

<!-- T2 는 소유자 지시(2026-09-13 "Phase 08 계획이랑 같이 올려줘")로 계획 PR 에 함께 들어갔다. T3·T6 은 사람이 실기기·계정으로 확인하는 Task 라 코드 Touches 가 없다.
     T5 의 CI 검사는 `.github/workflows/ci.yml` 을 고친다 — 병합 전 Lead 리뷰. Depends on 05·07 은 T6(SC-3~5)만 해당하고 T2~T5 는 지금 시작할 수 있다. -->

## Relevant Specifications

- `docs/PRD.md` — NFR-1, NFR-2, NFR-3, NFR-5, NFR-6, Success Criteria SC-1~6, Constraints(일정)
- `docs/decisions/ADR-20260913-hosting-and-domains.md`
- `docs/ARCHITECTURE.md` — External Systems(정적 호스팅·백엔드), Cross-cutting Concerns(설정)
- `docs/api/openapi.yaml` — servers(운영)

## Acceptance Criteria

- [ ] AC1. `main` 병합이 사람 손 없이 `https://threatoffate.site` 에 배포되고, 공유 링크 직접 진입·새로고침이 앱을 연다
- [ ] AC2. 운영 화면에서 백엔드 호출이 CORS 오류 없이 성공한다
- [ ] AC3. 공유 링크를 카카오·인스타·메신저에 붙이면 제목·설명·썸네일이 보인다 (NFR-3, SC-6)
- [ ] AC4. 모바일 느린 4G 에서 LCP < 2.5s, 초기 JS < 250KB gzip 이고 CI 가 JS 크기를 지킨다 (NFR-2)
- [ ] AC5. 실기기 iOS Safari·Android Chrome 에서 SC-1~6 과 NFR-1·5·6 확인 결과가 RESULT 에 있다

## Validation Plan

- AC1: 이 PLAN 병합 뒤 Netlify 배포 로그에서 커밋 SHA 확인, `/s/test` 새로고침 · T3
- AC2: 운영 화면 DevTools Network 에서 `api.threatoffate.site` 응답과 CORS 헤더 확인 · T3
- AC3: 카카오톡 공유 디버거(developers.kakao.com)·메신저 붙여넣기 스크린샷 · T4
- AC4: Lighthouse 모바일 3회 중앙값, CI 크기 검사 로그 · T5
- AC5: 기기별 체크리스트를 RESULT 에 표로 · T6
