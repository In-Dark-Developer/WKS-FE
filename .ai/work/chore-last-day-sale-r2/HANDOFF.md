# Handoff — chore-last-day-sale-r2

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-30
- Phase / Task: -/-

## Goal

할인 중 해금 모달 칸은 정가를 취소선으로, 그 아래 할인가를 빨간색으로 보인다.

## Work Completed

- `UnlockOption` 할인 표시를 두 줄(취소선 정가 `text-disabled` / 할인가 `text-status-error-foreground`)로

## Work In Progress

- 없음

## Files Changed

- `src/features/dating/unlock/UnlockDialog.tsx`

## Decisions Made

- 카드 알약·리롤 버튼은 한 줄이라 #336 의 인라인 취소선을 유지한다.

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · 미리보기 `/preview/dating-unlock` 마지막 날 할인 스크린샷

## Test Results

- 760 tests 통과, 경고 없음

## Known Problems

- 없음

## Unverified Assumptions

- 없음

## Exact Next Action

없음 — 릴리스 PR 병합만 남았다.
