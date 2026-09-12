# Current State — chore-pr-body-autofill

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: chore-pr-body-autofill
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/chore-pr-body-autofill
- Task: -/-
- Touches: scripts/ai-end.sh,.github/workflows/ci.yml,.ai/team/,.gitignore
- Supersedes: none
- Acked: 2026-09-12-pr-body-autofill, 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync

## Current Phase

— (Task 밖 스트림)

## Current Task

chore: pr-body-autofill

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- A. `ai-end.sh`: 초안 함수 분리 · `--pr-title`/`--pr-body` · `--ready --web` · 공지 색인 warn
- B. `ci.yml`: `pr-body` 잡 · `ai-check` 는 needs + 현재 제목·본문 조회 · types 에 edited
- C. 공지 + 색인 갱신 (병합된 spec PR 이 빼먹어 CI 가 FAIL 했다)
- D. 검증: `bash -n` · 초안 stdout · pr-body 판정 3 케이스 · pnpm test/typecheck/lint · `--ci` ←

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`b022f93`

## Relevant Documents

- `AGENTS.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `scripts/ai-end.sh:pr_draft_title`, `:pr_draft_body`, `:pr_draft_vars`
- `.github/workflows/ci.yml:pr-body`, `:ai-check`

## Next Action

`--ready --web` 으로 이 PR 을 열어 프리필을 확인한다. 병합 후 다음 PR 을 일부러 웹에서 템플릿 그대로 열어 `pr-body` 잡이 채우는지 본다.
