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

## Work In Progress

- 없음 — LCP 줄이는 변경은 승인 대기

## Files Changed

- 없음

## Decisions Made

- 없음

## Tests Executed

- 없음

## Test Results

- 없음

## Known Problems

- LCP 요소 = 인트로 영상(1.07MB, 포스터 없음). gtag 176KB·Amplitude 61KB 가 첫 화면 대역폭을 나눈다. 메인 번들 미사용 80KB
- 고칠 곳이 모두 T5 Touches 밖: `src/features/intro/IntroVideo.tsx`·`src/ui/assets/`·`src/lib/analytics.ts`·`index.html`·`src/app/routes/`

## Unverified Assumptions

- 없음

## Exact Next Action

승인된 범위로 CURRENT Touches 를 고친 뒤 인트로 포스터부터 적용하고 Lighthouse 3회 재측정
