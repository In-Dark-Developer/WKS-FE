# Current State — chore-app-structure-v1

- Stream: chore-app-structure-v1
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/chore-app-structure-v1
- Task: -/-
- Issue: none
- Touches: src/app/routes.tsx,src/app/routes.test.tsx,src/app/requireSession.ts,src/app/screens/,src/app/preview/screens/reading.tsx,docs/ARCHITECTURE.md
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-design-tokens, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo

## Current Phase

— (Task 밖 스트림)

## Current Task

chore: app-structure-v1

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 -->
- [x] 1. `requireSession.ts` → `routes/guards.ts` (`requireSession` → `requireSaju`)
- [x] 2. `routes.tsx` → `routes/{index,saju.routes,map.routes,share.routes}.tsx`
- [x] 3. `screens/ReadingScreen.tsx` → `screens/HomeScreen.tsx` (preview 참조 갱신)
- [x] 4. `routes.test.tsx` → `routes/index.test.tsx` 이동·import 갱신
- [x] 5. `docs/ARCHITECTURE.md` 의 `src/app/routes.tsx` 언급 갱신
- [x] 6. test · typecheck · lint

## Last Checkpoint

`b339093`

## Relevant Documents

- `AGENTS.md` · `docs/CONVENTIONS.md` · `docs/ARCHITECTURE.md`(Module Boundaries · Dependency Direction)

## Relevant Source Files

- `src/app/routes/index.tsx:routes`
- `src/app/routes/guards.ts:requireSaju`, `:requireMyResultId`
- `src/app/screens/HomeScreen.tsx:HomeScreen`
- `src/app/preview/screens/reading.tsx`

## Next Action

PR 리뷰. `chore-reading-back-always` 가 먼저 병합되면 `git merge main` 으로 받는다.
