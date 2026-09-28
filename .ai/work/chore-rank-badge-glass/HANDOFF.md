# Handoff — chore-rank-badge-glass

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-29
- Phase / Task: -/-

## Goal

카드 앞면의 Top 순위 배지가 Figma 112:3430 처럼 유리 효과로 보인다.

## Work Completed

- 배지에 점수 원과 같은 유리 규칙(뒤 흐림 4px · 테두리 광택) — `[data-score-glass]` 를 `[data-card-glass]` 로 합쳤다

## Work In Progress

- 없음

## Files Changed

- `src/features/dating/dating.css` ([data-card-glass]) · `src/features/dating/card/CandidateFaces.tsx`

## Decisions Made

- Figma 흐림은 배지 4 · 점수 원 4.38 — 차이가 눈에 띄지 않아 4px 하나로 합쳤다

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · 미리보기

## Test Results

- 전부 통과 · 경고 0

## Known Problems

- 없음

## Unverified Assumptions

- 없음

## Exact Next Action

PR 병합
