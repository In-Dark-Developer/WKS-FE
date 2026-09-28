# Handoff — chore-prd-completion-sync

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude
- To: 없음
- Date: 2026-09-24
- Phase / Task: -/-

## Goal

⚔️ PRD 보드의 UI 완료·기능 완료가 PLAN Task 의 [x] 에서 자동으로 계산된다.

## Work Completed

- `notion-index-sync.sh`: `plan_completion` 으로 FR별 UI/기능 완료 계산, `prd_props` 가 값이 있을 때만 보냄
- PLAN 09~11 Task 에 `FR:`/`UI:` 기입, 템플릿 형식 설명, 워크플로 push 경로에 PLAN 추가
- ADR-20260924-prd-completion-from-plans, 공지 2026-09-24-prd-completion-fields

## Work In Progress

- 없음

## Files Changed

- 없음

## Decisions Made

- UI Task 가 없는 FR 은 UI 완료 = 기능 완료. Task 가 가리키지 않는 FR 은 두 열을 보내지 않는다(V0.5 값 보존)
- PR 의 owner-drift 는 PLAN 변경으로 돌리지 않는다(Task PR 마다 돌 필요 없음)

## Tests Executed

- 없음

## Test Results

- 없음

## Known Problems

- FR-20 은 로그인 시트 화면(10/T4 LoginSheet)이 있어도 UI 완료가 꺼진 채다 — 09/T2 가 끝나야 켜진다. 필요하면 10/T4 에 `UI: FR-20` 을 더한다

## Unverified Assumptions

- 없음

## Exact Next Action

병합 후 dev push 동기화 로그에서 FR-19~31 의 두 체크박스가 dry-run 과 같게 들어갔는지 본다.
