# Current State — chore-notion-index-sync

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: chore-notion-index-sync
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/chore-notion-index-sync
- Task: -/-
- Touches: scripts/notion-index-sync.sh,scripts/lib/notion.sh,scripts/notion-sync.sh,.github/workflows/notion-index-sync.yml,docs/decisions/,.ai/team/announcements/
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-planning-feedback, 2026-09-13-backend-contract, 2026-09-13-drop-birth-region, 2026-09-13-issue-link, 2026-09-13-notion-index-sync

## Current Phase

— (Task 밖 스트림)

## Current Task

chore: notion-index-sync

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- [x] `scripts/lib/notion.sh` (notion_api·find·upsert) · `notion-sync.sh` 가 공유
- [x] `scripts/notion-index-sync.sh` — PRD FR/NFR·ADR upsert, Phase·상태 도출, `--dry-run`
- [x] 워크플로 `notion-index-sync.yml` (main docs 변경 · dispatch)
- [x] ADR-20260913-notion-index-sync · 공지 · 색인 · Notion 페이지 머리말 갱신
- [x] dry-run 24 FR/NFR · 9 ADR 검증

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`7db4054`

## Relevant Documents

- `docs/decisions/ADR-20260913-notion-index-sync.md` · `docs/decisions/ADR-20260912-notion-task-board-sync.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `scripts/notion-index-sync.sh:sync_prd`,`sync_adr`,`phases_of`,`status_of` · `scripts/lib/notion.sh:notion_upsert`

## Next Action

PR 병합 후 Actions 에서 `notion-index-sync` 를 dispatch 해 첫 실행을 확인한다 (NOTION_TOKEN 이 두 색인 DB 에 접근 권한이 있어야 한다).
