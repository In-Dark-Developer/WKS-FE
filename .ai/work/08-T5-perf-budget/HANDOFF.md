# Handoff — 08-T5-perf-budget

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-24
- Phase / Task: 08/T5

## Goal

운영 주소의 LCP(Lighthouse 모바일 느린 4G 3회 중앙값)와 초기 JS gzip 이 RESULT 에 기록되고, CI 가 초기 JS 250KB 초과를 실패시킨다 (NFR-2).

## Work Completed

- `scripts/check-bundle-size.mjs` + `pnpm check:bundle` + CI `bundle size` 단계 (초과·산출물 없음 경로 exit 1 확인)
- 운영 Lighthouse 3회: LCP 중앙값 4.77s(예산 2.5s 초과), FCP 3.65s, 초기 JS 161.4KB — RESULT T5 절
- B안: 인트로 poster(`public/intro-poster.webp`)+preload, gtag·Amplitude 를 load 뒤로 — 로컬 devtools LCP 5.03→2.52s (RESULT 2차 절)

## Work In Progress

- 없음

## Files Changed

- 없음

## Decisions Made

- 없음

## Tests Executed

- 없음

## Test Results

- 없음

## Known Problems

- simulate LCP 는 4.2s 그대로(비디오 LCP 모델링). 남은 병목은 FCP — 라우트 코드 분할(`src/app/routes/`, Lead)을 별도 Task 로 제안
- 포스터 preload 는 모든 경로에서 7KB 를 받는다(인트로는 `/` 첫 방문만) — 비용이 작아 받아들임
- ci.yml 변경은 병합 전 Lead 리뷰(PLAN)

## Unverified Assumptions

- 없음

## Exact Next Action

PLAN T5 에 작업 커밋 SHA → `scripts/ai-end.sh --ready` → 배포 뒤 운영 Lighthouse 3회 RESULT 에 추가
