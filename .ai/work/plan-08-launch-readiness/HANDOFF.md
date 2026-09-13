# Handoff — plan-08-launch-readiness

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-13
- Phase / Task: 08/-

## Goal

Phase 08 PLAN 이 배포·미리보기·성능·출시 점검 Task 로 채워지고, `netlify.toml` 이 있어 사이트 연결만 하면 자동 배포된다.

## Work Completed

- `netlify.toml`: pnpm build → dist, 운영 VITE_API_BASE_URL, SPA 폴백, /assets 장기 캐시 (T2 체크)
- 08 PLAN: T3 운영 연결 확인 · T4 공유 미리보기(공통 OG + 동적 방식 ADR) · T5 성능 예산(Lighthouse·CI 크기 검사) · T6 실기기 출시 점검

## Work In Progress

- 없음

## Files Changed

- `netlify.toml`, `docs/phases/08-launch-readiness/PLAN.md`, `docs/phases/README.md`

## Decisions Made

- 소유자: 계획 PR 에 netlify.toml 을 함께 올린다
- 분석 도구·인증 리다이렉트 페이지는 Out of Scope(ADR·Q14 선행)
- T2~T5 는 05·07 을 기다리지 않는다

## Tests Executed

- netlify.toml TOML 파싱, `pnpm build` 크기 확인, phases --check

## Test Results

- 통과 (JS 130KB gzip)

## Known Problems

- Netlify 의 pnpm 11·Node 26 지원은 첫 배포 로그로 확인 필요 — 실패하면 build.environment 에 NODE_VERSION·PNPM 설정 추가
- 배포 미리보기 주소는 백엔드 CORS 에 없으면 API 가 막힘

## Unverified Assumptions

- 운영 API `/api` 접두

## Exact Next Action

PR 리뷰 후 병합
