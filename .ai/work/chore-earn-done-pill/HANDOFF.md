# Handoff — chore-earn-done-pill

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-29
- Phase / Task: -/-

## Goal

운명의 실 안내에서 이미 받은 방법은 개수 없이 '지급 완료'만 줄 가운데에 보인다(Figma 445:2701).

## Work Completed

- `EarnRow`: 받았으면 '지급 완료' 알약만, 아니면 개수 칩만 — 둘 다 줄의 세로 가운데

## Work In Progress

- 없음

## Files Changed

- `src/features/dating/wallet/ThreadGuideDialog.tsx:EarnRow` · `src/features/dating/recommendation/DatingCards.test.tsx`

## Decisions Made

- 없음

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · 미리보기

## Test Results

- 전부 통과 · 알약 중심 = 줄 중심(355·445px)

## Known Problems

- 없음

## Unverified Assumptions

- 없음

## Exact Next Action

PR 병합
