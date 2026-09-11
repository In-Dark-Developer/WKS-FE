# Current State — chore-notion-sync

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: chore-notion-sync
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/chore-notion-sync
- Task: -/-
- Touches: scripts/notion-sync.sh,.github/workflows/notion-sync.yml,docs/decisions/,.ai/team/
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-notion-board-sync

## Current Phase

— (Task 밖 스트림)

## Current Task

chore: notion-sync

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- [x] 보드 스키마 확인 후 상태 매핑 확정, 보드에 `보류` 옵션 추가
- [x] `scripts/notion-sync.sh` — 브랜치 → 스트림 → 보드 행 갱신, `--check`는 접근·쓰기만 확인
- [x] `.github/workflows/notion-sync.yml` — `ws/**` push · PR 이벤트
- [x] ADR·공지
- [x] Actions 로그로 토큰·읽기·쓰기·Task 경로 확인

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`b89b201`

## Relevant Documents

- `docs/decisions/ADR-20260912-notion-task-board-sync.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `scripts/notion-sync.sh:patch_page` · `scripts/notion-sync.sh:find_row` · `.github/workflows/notion-sync.yml`

## Next Action

PR 을 올려 병합한다. 병합 후 01/T2 스트림이 열릴 때 보드가 진행중으로 바뀌는지 눈으로 확인한다.
