# Current State — chore-notion-owner-people

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: chore-notion-owner-people
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/chore-notion-owner-people
- Task: -/-
- Touches: scripts/notion-sync.sh,docs/decisions/ADR-20260912-notion-task-board-sync.md
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-planning-feedback

## Current Phase

— (Task 밖 스트림)

## Current Task

chore: notion-owner-people

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- [x] Notion Task 보드 Owner 를 text → Person 으로 바꾸고 28행 채움 (jjjung0921→정진 이, nicerjs23→이동건, gn00py48→근우 강)
- [x] notion-sync.sh: owner_uid 표 + people 페이로드
- [x] ADR Owner 문장 갱신
- [x] bash -n · props_json jq 출력 확인

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`1c20bb8`

## Relevant Documents

- `AGENTS.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `scripts/notion-sync.sh:owner_uid`, `scripts/notion-sync.sh:props_json`

## Next Action

PR 병합 후 다음 `ws/**` push 의 notion-sync 잡 로그에서 `Owner @…` 가 찍히고 보드 Owner 가 사람으로 보이는지 확인한다.
