# Current State — chore-drop-signup-photo

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: chore-drop-signup-photo
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/chore-drop-signup-photo
- Task: -/-
- Issue: none
- Touches: src/features/profile/,src/api/schema/signups.ts,docs/PRD.md,docs/api/openapi.yaml,docs/phases/06-dating-gate/PLAN.md
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-design-tokens, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-14-result-ownership

## Current Phase

— (Task 밖 스트림)

## Current Task

chore: drop-signup-photo

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 1. 사전신청 사진 칸 제거·고지·명세 갱신 (commit 330d614) → PR ←

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`330d614`

## Relevant Documents

- `AGENTS.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/features/profile/PreRegisterForm.tsx:PreRegisterForm` · `src/features/profile/consent.ts:consentNotice`

## Next Action

PR CI 통과 → merge
