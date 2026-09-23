# Current State — chore-owner-drift-check

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: chore-owner-drift-check
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/chore-owner-drift-check
- Task: -/-
- Issue: none
- Touches: scripts/notion-index-sync.sh,scripts/lib,.github/workflows/notion-index-sync.yml,docs/decisions,.ai/team
- Supersedes: none
- Acked: none

## Current Phase

— (Task 밖 스트림)

## Current Task

chore: owner-drift-check

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- `--check-owners` 추가 — 보드 `담당자` ↔ 저장소 `담당` 대조 (읽기 전용)
- 표시 이름 ↔ 저장소 표기 대응표 `scripts/lib/notion-owners.tsv`
- `owner-drift` job 추가 (docs/prd 를 건드리는 PR), 공지

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`990a7bc`

## Relevant Documents

- `AGENTS.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `scripts/notion-index-sync.sh:check_owners` · `scripts/lib/notion.sh:notion_query_page`

## Next Action

PR 을 열고 owner-drift 결과를 확인한 뒤 병합한다.
