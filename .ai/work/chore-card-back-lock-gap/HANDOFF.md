# Handoff — chore-card-back-lock-gap

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-27
- Phase / Task: -/-

## Goal

잠긴 이름·학과 줄이 연달아 있어도 자물쇠 알약이 겹치지 않는다.

## Work Completed

- 알약(28px) > 글줄(18px) 이라 gap-8 에서 겹쳤다 — 알약이 있으면 gap-16

## Work In Progress

- 없음

## Files Changed

- `src/features/dating/card/CandidateFaces.tsx` · `src/app/preview/screens/dating-cards.tsx`

## Decisions Made

- 2026-09-27 소유자: 위아래 간격을 늘려 해결

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · 브라우저 미리보기(알약 사이 6px)

## Test Results

- 622 passed, 경고 없음

## Known Problems

- 없음

## Unverified Assumptions

- 없음

## Exact Next Action

없음
