# Current State — chore-issue-link

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: chore-issue-link
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/chore-issue-link
- Task: -/-
- Issue: none
- Touches: scripts/ai-stream.sh,scripts/ai-end.sh,scripts/lib/common.sh,.ai/work/_template/CURRENT.md,AGENTS.md,.ai/team/announcements/
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-planning-feedback, 2026-09-13-backend-contract, 2026-09-13-drop-birth-region, 2026-09-13-issue-link

## Current Phase

— (Task 밖 스트림)

## Current Task

chore: issue-link

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- [x] ai-stream.sh open: `--issue N` 파싱, `open --issue N <slug>` 제목에서 Task 추출, CURRENT `Issue:`, 이슈 코멘트
- [x] common.sh render `{{ISSUE}}` · CURRENT 템플릿 `Issue:` 줄
- [x] ai-end.sh PR 본문 첫 줄 `Closes #N`
- [x] AGENTS.md Session Procedure · 공지 `issue-link` · 색인
- [x] bash -n · 제목 정규식 · --pr-body Closes · render 테스트

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`96dce6f`

## Relevant Documents

- `AGENTS.md` Session Procedure · `.ai/team/announcements/2026-09-13-issue-link.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `scripts/ai-stream.sh:cmd_open` · `scripts/ai-end.sh:pr_draft_vars`,`pr_draft_body` · `scripts/lib/common.sh:render`

## Next Action

PR 병합 후 팀원이 `scripts/ai-stream.sh open --issue <N> <slug>` 로 Phase 02·03 Task 를 연다.
