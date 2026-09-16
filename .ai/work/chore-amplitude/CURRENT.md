# Current State — chore-amplitude

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: chore-amplitude
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/chore-amplitude
- Task: -/-
- Issue: none
- Touches: src/lib/analytics.ts,src/main.tsx,src/app/routes.tsx,src/app/preview/screens/share.tsx,src/features/saju/sajuAction.ts,src/features/share/link/ShareLinkButton.tsx,src/features/friends/joinShareLoader.ts,package.json,pnpm-lock.yaml,docs/decisions/
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-design-tokens, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-14-result-ownership

## Current Phase

— (Task 밖 스트림)

## Current Task

chore: amplitude

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 1. `analytics.ts` 창구(SDK 동적 import)·이벤트 6개 연결·ADR-20260916 (commit db80d5e)
- 2. test 327 · typecheck · lint · build 통과 → PR → CI 통과 시 merge ←

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`db80d5e`

## Relevant Documents

- `AGENTS.md` · `docs/decisions/ADR-20260916-amplitude-product-analytics.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/lib/analytics.ts:initAnalytics` · `:track`
- `src/app/routes.tsx:protectedReadingLoader` · `:protectedMapLoader` · `:trackedShareMapLoader`
- `src/features/saju/sajuAction.ts:createSajuAction` · `src/features/friends/joinShareLoader.ts:joinShare`

## Next Action

PR CI 통과 → merge → 배포 후 Amplitude 실시간 보고서로 이벤트 도착 확인
