# Current State — spec-commit-type-ci

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: spec-commit-type-ci
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/spec-commit-type-ci
- Task: -/-
- Touches: AGENTS.md,.githooks/commit-msg,scripts/ai-end.sh,.ai/team/
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-notion-board-sync, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci

## Current Phase

— (Task 밖 스트림)

## Current Task

spec: commit-type-ci

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- [x] `.githooks/commit-msg` 정규식·안내문에 `ci` 추가
- [x] `scripts/ai-end.sh` 의 PR 제목 검사에 `ci` 추가
- [x] `AGENTS.md` Commit Format type 목록 갱신
- [x] 공지 작성 (AGENTS.md 변경은 공지 필수)

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`e5f2968`

## Relevant Documents

- `AGENTS.md` Commit Format · `.githooks/commit-msg`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- (아직 없음)

## Next Action

PR 병합. 이후 CI·워크플로 커밋은 `ci(<scope>)` 로 쓴다.
