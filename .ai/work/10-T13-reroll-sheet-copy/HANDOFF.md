# Handoff — 10-T13-reroll-sheet-copy

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: @nicerjs23 (claude-code)
- To: @jjjung0921 (이정진 · Phase 10 Lead — PR 리뷰)
- Date: 2026-09-28
- Phase / Task: 10/T13

## Goal

리롤 확인 시트의 문구가 디자인과 같고, 무료·유료·잔액 부족 세 상태가 서버가 정한 비용과 맞는다.

## Work Completed

- Figma 시트 두 개(`112:3773` 무료 o · `112:3675` 무료 x)를 직접 읽어 대조했다 — 제목·본문·'자정까지 기다릴게요' 는 이미 같았고 **유료 버튼 어순만 달랐다**
- `5실로 지금 변경하기` → **`실 N개로 지금 변경하기`**(Figma 어순). 개수는 서버가 준 `rerollCost` 라 비용이 바뀌면 화면이 따라간다
- 잔액 부족 안내에 필요한 개수를 넣었다 — "운명의 실 N개가 필요해요. 자정에 무료 점지권이 다시 생겨요."(이 상태는 디자인에 없다)

## Work In Progress

- 없음 (PR 대기)

## Files Changed

- `src/features/dating/recommendation/RerollSheet.tsx` · `DatingCards.test.tsx`·`DatingCardsScreen.test.tsx`(문구 기대값)

## Decisions Made

- 숫자를 문구에 박지 않는다 — 비용 판정은 서버(`rerollCost`)가 하고 화면은 옮긴다
- 잔액 부족 문구는 디자인에 없어 그대로 두고 개수만 더했다

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint`

## Test Results

- 114 files / 651 passed · typecheck·lint 경고 0

## Known Problems

- **비용 확정값은 20 인데 지금 백엔드는 5 를 내려준다**(2026-09-28 소유자 확인, 백엔드가 고치기로 했다). 화면은 서버 값을 쓰므로 백엔드가 바뀌면 자동으로 20 이 보인다
- 그 사이 문서·목이 5 로 남아 있다 — PRD FR-27 · openapi 설명 · 목 리롤 비용. 이어지는 스트림에서 20 으로 맞춘다

## Unverified Assumptions

- 없음

## Exact Next Action

비용 20 을 PRD·openapi·목에 반영하는 스트림을 연다.
