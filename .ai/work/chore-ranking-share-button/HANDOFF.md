# Handoff — chore-ranking-share-button

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-17
- Phase / Task: -/-

## Goal

결과 화면 친구 궁합 순위가 있어도 목록 아래 '친구에게 공유'가 보인다.

## Work Completed

- `FriendRanking` 의 `emptyAction` 을 `shareAction` 으로 — 비면 안내 아래, 있으면 목록 아래(좌우 20 안쪽)
- routes·미리보기·테스트, PRD FR-4

## Work In Progress

- 없음

## Files Changed

- `src/features/friends/map/FriendRanking.tsx` · `CompatibilityMapScreen.test.tsx` · `src/app/routes.tsx`·`routes.test.tsx` · `src/app/preview/screens/map.tsx` · `docs/PRD.md`

## Decisions Made

- 버튼 폭은 Figma 285/343 에 가장 가까운 토큰 `px-20`(287px)

## Tests Executed

- pnpm test·lint·typecheck (exit code) · iOS 시뮬레이터 `/preview/map` 순위 요약

## Test Results

- 모두 exit 0 · test 364

## Known Problems

- 없음

## Unverified Assumptions

- 없음

## Exact Next Action

PR merge 후 fork 로 배포.
