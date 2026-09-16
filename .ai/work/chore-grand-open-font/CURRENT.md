# Current State — chore-grand-open-font

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: chore-grand-open-font
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/chore-grand-open-font
- Task: -/-
- Issue: none
- Touches: src/ui/tokens/fonts/,src/ui/tokens/theme.css,src/features/profile/PreRegisterTeaser.tsx,src/lib/cn.ts,docs/api/openapi.yaml,docs/PRD.md,docs/phases/06-dating-gate/PLAN.md
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-design-tokens, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-14-result-ownership

## Current Phase

— (Task 밖 스트림)

## Current Task

chore: grand-open-font

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 1. 카페24 공식 배포본의 웹폰트(woff2)를 `src/ui/tokens/fonts/` 에 추가
- 2. `--font-slim`·`--text-display-40` 토큰과 티저 적용, 백엔드 배포 사실 문서 반영 (commit 397f086)
- 3. PR → CI 통과 시 merge ←

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`397f086`

## Relevant Documents

- `AGENTS.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/ui/tokens/theme.css` (@font-face · --font-slim · --text-display-40)
- `src/features/profile/PreRegisterTeaser.tsx` · `src/lib/cn.ts`

## Next Action

PR CI 통과 → merge
