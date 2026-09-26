# Handoff — 09-T1-home-tab-back

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-26
- Phase / Task: 09/T1

## Goal

홈 탭을 누르면 사주 결과(= 홈, Figma v1.0 `8:794`)가 보이고, 브라우저 뒤로 가기를 한 번 누르면 누르기 전 화면이 보인다 — 이미 홈에서 홈을 다시 눌러도 마찬가지다.

## Work Completed

- `BottomNavBar` 가 현재 주소와 같은 곳으로는 이동하지 않는다 (commit 03286e9)
- 테스트 2건: 홈 탭 → 뒤로 가기 = 이전 화면 · 이미 홈에서 홈 재선택 → 뒤로 가기 = 이전 화면

## Work In Progress

- 없음

## Files Changed

- `src/app/screens/BottomNavBar.tsx:BottomNavBar`
- `src/app/routes/index.test.tsx` (하단 네비 절)

## Decisions Made

- 같은 주소면 아무것도 하지 않는다(`replace` 아님) — 이동할 것이 없다. 궁합지도·소개팅 탭에도 같이 적용된다(같은 결함이다)
- 사주 없음 → 사주 입력은 FR-19 그대로 둔다

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint`

## Test Results

- 531/531 통과 · 타입 오류 0 · 린트 경고 0. 추가 2건 중 재선택 테스트는 수정 전 실패(`/reading/…`)

## Known Problems

- 없음

## Unverified Assumptions

- 없음

## Exact Next Action

`git merge dev` → `scripts/ai-end.sh --ready` → PR (base dev).
