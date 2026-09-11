# Current State — 01-T4-skeleton

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 01-T4-skeleton
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/01-T4-skeleton
- Task: 01/T4
- Touches: index.html,src/,tests/,vitest.config.ts,docs/phases/01-project-setup/PLAN.md,tsconfig.json
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-notion-board-sync, 2026-09-12-board-rows-for-streams

## Current Phase

01-project-setup — `docs/phases/01-project-setup/PLAN.md`

## Current Task

T4. 최소 실행 스켈레톤 + 테스트

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- [x] `index.html` · `src/main.tsx` 진입
- [x] `src/app/App.tsx`(RouterProvider) · `routes.tsx` · 빈 화면
- [x] `tests/setup.ts` + `vitest.config.ts`의 setupFiles 연결
- [x] 라우트 렌더 테스트 1개
- [x] test·typecheck·lint·build 통과, dev 서버에서 실제 렌더 확인

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`61b0728`

## Relevant Documents

- `docs/phases/01-project-setup/PLAN.md` T4 · `docs/CONVENTIONS.md` 2·3·6절

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/app/routes.tsx:routes` · `src/app/App.tsx:App` · `src/main.tsx` · `tests/setup.ts`
