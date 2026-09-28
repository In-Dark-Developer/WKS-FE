# Handoff — chore-card-bio-wrap

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-28
- Phase / Task: -/-

## Goal

띄어쓰기 없는 자기소개도 소개팅 카드 폭 안에서 줄을 바꾼다.

## Work Completed

- 자기소개 p 에 wrap-anywhere (652eeaf)

## Work In Progress

- 없음

## Files Changed

- src/features/dating/card/CandidateFaces.tsx
- src/app/preview/screens/dating-cards.tsx

## Decisions Made

- 없음

## Tests Executed

- pnpm test · typecheck · lint, 미리보기 375px 에서 문단 폭 301px·카드 안 측정

## Test Results

- 통과 (jsdom 은 레이아웃을 재지 못해 단위 테스트 대신 미리보기로 확인)

## Known Problems

- BE 는 bio 를 500자까지 받는다(FE 는 170) — 170자를 넘는 기존 데이터는 카드 아래로 넘칠 수 있다

## Unverified Assumptions

- 없음

## Exact Next Action

<다음 세션(또는 다음 사람)이 첫 번째로 할 일 한 줄>
