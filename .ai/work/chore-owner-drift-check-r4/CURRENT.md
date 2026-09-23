# Current State — chore-owner-drift-check-r4

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: chore-owner-drift-check-r4
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/chore-owner-drift-check-r4
- Task: -/-
- Issue: none
- Touches: scripts/notion-index-sync.sh,scripts/lib
- Supersedes: none
- Acked: none

## Current Phase

— (Task 밖 스트림)

## Current Task

chore: owner-drift-check-r4

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 대응표에 없는 표시 이름은 그대로 쓴다 (넷 중 둘은 표기가 같다)
- 표기가 다른 둘(`정진 이`·`근우 강`)만 표에 남긴다

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`0817b4c`

## Relevant Documents

- `AGENTS.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `scripts/notion-index-sync.sh:map_owners` · `scripts/lib/notion-owners.tsv`

## Next Action

PR 을 열고 CI 통과 후 병합한다.
