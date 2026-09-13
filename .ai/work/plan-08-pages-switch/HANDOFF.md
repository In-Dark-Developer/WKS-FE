# Handoff — plan-08-pages-switch

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-13
- Phase / Task: 08/-

## Goal

main 의 Phase 08 PLAN·배포 설정이 Cloudflare Pages(ADR-20260913-cloudflare-pages-hosting) 기준이다.

## Work Completed

- #66 이 Netlify 판으로 먼저 병합돼 수정분을 다시 올림: netlify.toml 삭제, `public/_headers`(해시 자산 장기 캐시), PLAN T2 체크 SHA 교체·T3 첫 배포 확인·T4 Pages Functions·Dependencies 에 Pages 대시보드 입력값과 네임서버 이전 순서

## Work In Progress

- 없음

## Files Changed

- `netlify.toml`(삭제), `public/_headers`, `docs/phases/08-launch-readiness/PLAN.md`, `docs/phases/README.md`

## Decisions Made

- SPA 라우팅은 `_redirects` 없이 Pages 기본 동작(최상위 404.html 없음)

## Tests Executed

- `pnpm build` 산출물에 `_headers` 복사·404.html 없음, phases --check

## Test Results

- 통과

## Known Problems

- Pages 빌드 이미지 기본 pnpm 10 — PNPM_VERSION=11.22.0, Node 26 은 첫 배포로 확인
- 네임서버 이전 전 `api` 레코드 이관은 백엔드 팀과 함께

## Unverified Assumptions

- 없음

## Exact Next Action

PR 리뷰 후 병합
