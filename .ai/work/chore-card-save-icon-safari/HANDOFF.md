# Handoff — chore-card-save-icon-safari

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-27
- Phase / Task: -/-

## Goal

Safari 에서도 카드 뒷면에 저장 아이콘이 보이지 않는다.

## Work Completed

- WebKit 은 z-index 로 따로 그리는 자식에 부모 backface-visibility 를 안 먹여 뒷면에 거울상으로 비친다 → 칸에 backface-visibility + 뒷면 visibility hidden

## Work In Progress

- 없음

## Files Changed

- `src/features/share/card/ConnectionCard.css`

## Decisions Made

- 없음

## Tests Executed

- `pnpm test` · `pnpm lint` · Chromium 에서 앞·뒷면 visibility 확인

## Test Results

- 622 passed. Safari 실기기는 미확인

## Known Problems

- 없음

## Unverified Assumptions

- 원인은 WebKit 레이어 동작 추정 — visibility 규칙으로 원인과 무관하게 막았다

## Exact Next Action

iOS Safari 실기기 확인
