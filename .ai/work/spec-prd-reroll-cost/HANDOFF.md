# Handoff — spec-prd-reroll-cost

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: @nicerjs23 (claude-code)
- To: @jjjung0921 (이정진 · PR 리뷰 — 2026-09-27 요청)
- Date: 2026-09-27
- Phase / Task: -/-

## Goal

PRD FR-27 의 리롤 비용이 백엔드 확정값(5실)과 같아지고, 비용·무료 여부를 누가 판정하는지가 적힌다.

## Work Completed

- `docs/prd/30-functional-requirements.md` FR-27 — '실 3개' → '실 5개', 자정 기준을 KST 로 명시, 판정 주체를 서버(`rerollCost`)로 적음
- 잔액 부족·후보 소진일 때 카드를 바꾸지 않고 알린다는 문장 추가 — 구현(#242)이 이미 그렇게 동작한다

## Work In Progress

- 없음

## Files Changed

- `docs/prd/30-functional-requirements.md` (FR-27 한 줄)

## Decisions Made

- 문구만 고치고 담당·우선순위·Area 는 건드리지 않았다 — 보드의 `담당자` 가 원본이라 owner-drift 검사가 도는 열이다

## Tests Executed

- 없음 (문서 변경)

## Test Results

- 없음

## Known Problems

- 없음

## Unverified Assumptions

- 없음

## Exact Next Action

병합 뒤 Notion ⚔️ PRD 의 FR-27 문구가 다음 push 에 맞춰진다 — 보드에서 따로 고칠 것은 없다.
