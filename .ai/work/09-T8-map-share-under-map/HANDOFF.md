# Handoff — 09-T8-map-share-under-map

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-26
- Phase / Task: 09/T8

## Goal

내 궁합지도의 '친구에게 공유하고 궁합 지도 넓히기'가 로그인 여부와 무관하게 지도 바로 아래에 있다.

## Work Completed

- `CompatibilityMapScreen` mine 은 share 를 지도 바로 아래(gap 12), visitor 는 그대로 맨 아래
- PRD FR-14 '맨 아래' → '지도 바로 아래'(2026-09-26 소유자 확정, Figma v1.0 57:2523)

## Work In Progress

- 없음

## Files Changed

- `src/features/friends/map/CompatibilityMapScreen.tsx(+test)` · `src/app/screens/MyMapScreen.tsx`(주석) · `docs/prd/30-functional-requirements.md`

## Decisions Made

- 소유자 확정: 공유 버튼은 지도 아래로 통일. 방문자 지도의 '내 사주 내용도 확인하기'는 다른 버튼이라 그대로 둔다.

## Tests Executed

- `pnpm test`·`typecheck`·`lint` (지도 → 공유 → 순위 순서 테스트)

## Test Results

- 통과

## Known Problems

- 브라우저 화면 대조는 못 함 — DOM 순서 테스트로 확인. T8 실제 모드 확인은 남음

## Unverified Assumptions

- 없음

## Exact Next Action

dev 도메인에서 T8 실제 모드 확인 후 PLAN 체크.
