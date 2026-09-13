# Current State — chore-notion-phase-detail

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: chore-notion-phase-detail
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/chore-notion-phase-detail
- Task: -/-
- Issue: none
- Touches: scripts/notion-index-sync.sh,.github/workflows/notion-index-sync.yml,docs/decisions/ADR-20260913-notion-index-sync.md
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-planning-feedback, 2026-09-13-backend-contract, 2026-09-13-drop-birth-region, 2026-09-13-issue-link, 2026-09-13-notion-index-sync

## Current Phase

— (Task 밖 스트림)

## Current Task

chore: notion-phase-detail

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- [x] Notion Phase 색인 DB 에 `Goal`·`Scope`·`Task 보드`(관계, 양방향 `Phase 색인`) 열 추가
- [x] `--phases` 가 PLAN ## Goal·## Scope 를 읽고 Task 보드에서 Phase select 가 같은 행을 관계로 연결
- [x] 워크플로 env `NOTION_TASK_DB` · ADR 열 설명 갱신 · dry-run 8행

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`a051ac0`

## Relevant Documents

- `docs/decisions/ADR-20260913-notion-index-sync.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `scripts/notion-index-sync.sh:phase_props`,`task_row_ids`,`plan_goal`,`plan_scope`,`sync_phases`

## Next Action

PR 병합 후 Actions `notion-index-sync` Run workflow — Phase 색인 8행에 Goal·Scope·Task 보드 관계가 채워지는지 확인.
