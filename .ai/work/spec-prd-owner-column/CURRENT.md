# Current State — spec-prd-owner-column

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: spec-prd-owner-column
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/spec-prd-owner-column
- Task: -/-
- Issue: none
- Touches: docs/prd/30-functional-requirements.md,docs/prd/40-quality.md
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-design-tokens, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-planning-feedback, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-split

## Current Phase

— (Task 밖 스트림)

## Current Task

spec: prd-owner-column

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- FR·NFR 표 맨 끝에 `담당` 열을 붙이고 2026-09-23 V1 배정 19건을 적음
- 보드가 원본이라는 것과 `—` 의 뜻을 두 표 머리에 적음
- `notion-index-sync.sh --prd --dry-run` 으로 파싱이 그대로인지 확인
- 배정 39건으로 갱신하고 `## 선후 관계` 절을 더함

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`3178c00`

## Relevant Documents

- `docs/decisions/ADR-20260923-prd-single-notion-db.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `docs/prd/30-functional-requirements.md`
- `docs/prd/40-quality.md`

## Next Action

리뷰 후 dev 에 병합한다.
