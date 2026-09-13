# Handoff — spec-drop-birth-region

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-13
- Phase / Task: -/-

## Goal

사주 입력에서 태어난 지역이 빠진 것이 PRD·PLAN 03·openapi 참조본·공지에 반영되어 있다.

## Work Completed

- PRD US-1·FR-2 에서 지역 제거, Q6 삭제 · PLAN 03 Scope·Dependencies·T4·AC2 · openapi `birthRegion` 설명 · 공지

## Work In Progress

- 없음

## Files Changed

- docs/PRD.md · docs/phases/03-saju-reading/PLAN.md · docs/api/openapi.yaml · .ai/team/announcements/2026-09-13-drop-birth-region.md

## Decisions Made

- 백엔드 계약(api-spec.md)에는 `birthRegion` 이 아직 있으므로 참조본에서 필드를 지우지 않고 '항상 null' 로 표기, 제거는 백엔드에 요청

## Tests Executed

- ai-end.sh --ready (phases --check 포함)

## Test Results

- 통과

## Known Problems

- 없음

## Unverified Assumptions

- 없음

## Exact Next Action

PR 병합 후 백엔드에 `birthRegion` 제거를 요청한다.
