# Current State — chore-app-structure-v1

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: chore-app-structure-v1
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/chore-app-structure-v1
- Task: -/-
- Issue: none
- Touches: src/app/routes.tsx,src/app/routes.test.tsx,src/app/requireSession.ts,src/app/screens/,src/app/preview/screens/reading.tsx,docs/ARCHITECTURE.md
- Supersedes: none
- Acked: 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo

## Current Phase

— (Task 밖 스트림)

## Current Task

chore: app-structure-v1

## Status

IN_PROGRESS

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- [ ] 1. `requireSession.ts` → `routes/guards.ts` (`requireSession` → `requireSaju`) ←
- [ ] 2. `routes.tsx` → `routes/{index,saju.routes,map.routes,share.routes}.tsx`
- [ ] 3. `screens/ReadingScreen.tsx` → `screens/HomeScreen.tsx` (preview 참조 갱신)
- [ ] 4. `routes.test.tsx` → `routes/index.test.tsx` 이동·import 갱신
- [ ] 5. `docs/ARCHITECTURE.md` 의 `src/app/routes.tsx` 언급 갱신
- [ ] 6. test · typecheck · lint

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`54b1bde`

## Relevant Documents

- `AGENTS.md`
- `docs/CONVENTIONS.md`
- `docs/ARCHITECTURE.md` (Module Boundaries · Dependency Direction)

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/app/routes.tsx:routes`
- `src/app/requireSession.ts:requireSession`, `:requireMyResultId`
- `src/app/screens/ReadingScreen.tsx:ReadingScreen`
- `src/app/preview/screens/reading.tsx`

## Next Action

step 1 — `src/app/routes/guards.ts` 를 만들고 `requireSession.ts` 를 지운다.
