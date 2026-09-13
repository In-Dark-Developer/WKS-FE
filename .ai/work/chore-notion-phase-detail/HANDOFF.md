# Handoff — chore-notion-phase-detail

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-13
- Phase / Task: -/-

## Goal

Notion Phase 색인의 각 행에 그 Phase 의 목표·범위 설명과 Task 보드의 해당 Task 행들이 연결되어 있고, main 병합마다 CI 가 유지한다.

## Work Completed

- Phase 색인 DB 스키마: `Goal`·`Scope` 텍스트, `Task 보드` 관계(양방향 — 보드 행에 `Phase 색인` 열 생김)
- `notion-index-sync.sh --phases`: PLAN `## Goal` 첫 문단 · `## Scope` 항목(`·` 연결, 1900자 컷) · Task 보드 query(`Phase` select equals "NN name") → relation ids
- 워크플로 env `NOTION_TASK_DB` · ADR-20260913 열 설명

## Work In Progress

- 없음

## Files Changed

- `scripts/notion-index-sync.sh` · `.github/workflows/notion-index-sync.yml` · `docs/decisions/ADR-20260913-notion-index-sync.md`

## Decisions Made

- Task 연결은 보드의 `Phase` select 값("02 design-system")으로 찾는다 — 보드 행은 사람이 만들고 Phase 를 고르므로 그 값이 유일한 키다. NOTION_TASK_DB 없으면 관계만 생략

## Tests Executed

- `bash -n` · `--phases --dry-run`(Goal·Scope 채워짐, 관계는 dry-run 에서 생략)

## Test Results

- 8행 정상. 관계 query 는 토큰이 없어 미실행

## Known Problems

- 관계 write 미검증 — 병합 후 dispatch 로 확인. 보드 행이 100개를 넘으면 page_size 100 페이지네이션 필요(지금 30행)

## Unverified Assumptions

- Notion API 가 relation 을 `{ relation: [{id}] }` 로 받는다 (2022-06-28 버전 문서 기준)

## Exact Next Action

PR 병합 → Actions `notion-index-sync` Run workflow → Phase 색인 확인.