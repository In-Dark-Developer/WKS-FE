# Handoff — chore-map-back-to-reading

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-15
- Phase / Task: -/-

## Goal

Figma 개정대로 친구의 궁합 지도(SCR-13, 720:3668)에서 뒤로가기가 빠지고, 그 지도에서 들어온 내 사주(SCR-04, 720:3587)에 뒤로가기가 생겨 지도와 내 사주를 오간다.

## Work Completed

- 친구의 궁합 지도 뒤로가기 제거, 지도 → 내 사주 이동에 state 표시, 내 사주 맨 위 뒤로가기(navigate(-1)) (5d9bd35)
- PRD SCR-04·SCR-13·FR-6 갱신 (453740a)

## Work In Progress

- 없음

## Files Changed

- `src/app/routes.tsx:ReadingResultRoute,SharedMapRoute` · `src/features/saju/ReadingResult.tsx` · `src/features/friends/map/CompatibilityMapScreen.tsx`(back prop 삭제) · preview map/reading · 각 테스트 · `docs/PRD.md`

## Decisions Made

- 뒤로가기 표시는 이동 기록 state(`{ from: 'shared-map' }`)로 판단 — 새로고침에도 유지, 새 탭·직접 진입엔 없음. 이동은 navigate(-1)(앞 기록이 그 지도)

## Tests Executed

- pnpm test · pnpm typecheck · pnpm lint · /preview/reading 브라우저 확인

## Test Results

- 61 files / 322 tests passed, typecheck·lint 경고 없음

## Known Problems

- 없음

## Unverified Assumptions

- 720:3587 의 뒤로가기는 공유 흐름(SCR-13 에서 온 내 사주)에만 해당하고, `/` 에서 만든 결과 화면(658:5075)에는 없다

## Exact Next Action

PR 리뷰 → 병합
