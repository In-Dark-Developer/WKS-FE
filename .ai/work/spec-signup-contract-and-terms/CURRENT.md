# Current State — spec-signup-contract-and-terms

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: spec-signup-contract-and-terms
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/spec-signup-contract-and-terms
- Task: -/-
- Issue: none
- Touches: docs/PRD.md,docs/api/openapi.yaml,docs/phases/06-dating-gate/PLAN.md,docs/decisions/
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-design-tokens, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-14-result-ownership

## Current Phase

— (Task 밖 스트림)

## Current Task

spec: signup-contract-and-terms

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 1. openapi `/signups`·`/signups/resend`·`/signups/verify` 를 실제 백엔드에 맞춤
- 2. PRD FR-9·FR-10·FR-17·SCR 표·Q14 갱신, SCR-14 `/verify` 추가
- 3. Phase 06 PLAN — 차단 해제, T3 범위 조정, T4 추가
- 4. ADR-20260916-signup-contract-gap → PR → CI 통과 시 merge ←

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`3295525`

## Relevant Documents

- `AGENTS.md` · `docs/decisions/ADR-20260916-signup-contract-gap.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `docs/api/openapi.yaml#/paths/~1signups` · `docs/PRD.md` FR-9·10·17 · `docs/phases/06-dating-gate/PLAN.md`

## Next Action

PR CI 통과 → merge → 06/T3·T4 구현 스트림을 연다
