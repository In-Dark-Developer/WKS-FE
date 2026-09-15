# Handoff — 05-T8-intro-countdown

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: @nicerjs23 (`src/features/` Owner — 리뷰)
- Date: 2026-09-15
- Phase / Task: 05/T8

## Goal

인트로 건너뛰기 칸이 처음 2초 동안 2 → 1 숫자를 보이고 2초에 '건너뛰기' 버튼이 된다 (PLAN 05/T8).

## Work Completed

- `IntroVideo.tsx`: 건너뛰기 칸이 2초 동안 남은 초(2 → 1)를 1초마다 보이고 0 에 '건너뛰기' 버튼 — 칸 크기는 보이지 않는 '건너뛰기' 글자로 유지, 숫자는 `aria-hidden` 칸 안 · 테스트 1개 (commit 85999c7)

## Work In Progress

- 없음 (PR 리뷰 대기)

## Files Changed

- `src/features/intro/IntroVideo.tsx` · `IntroVideo.test.tsx`

## Decisions Made

- `setInterval` 하나로 센다 — 기존 테스트처럼 2초를 한 번에 넘겨도 버튼이 뜬다

## Tests Executed

- `pnpm test`·`typecheck`·`lint`·`build` · 개발 서버 390px 첫 방문: 1초에 칸 '2', 3초 뒤 '건너뛰기' 버튼, 콘솔 오류 없음

## Test Results

- test 307 passed, 경고 없음, build 성공, 브라우저 확인 기대대로

## Known Problems

- 없음

## Unverified Assumptions

- 없음

## Exact Next Action

PR 병합 → 실기기에서 인트로 확인(08/T6)
