# Current State — 01-T3-toolchain

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 01-T3-toolchain
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/01-T3-toolchain
- Task: 01/T3
- Touches: package.json, pnpm-lock.yaml, .nvmrc, tsconfig*.json, vite.config.ts, vitest.config.ts, eslint.config.js, .prettierrc, .gitignore, docs/phases/01-project-setup/PLAN.md
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-notion-board-sync, 2026-09-12-board-rows-for-streams

## Current Phase

01-project-setup — `docs/phases/01-project-setup/PLAN.md`

## Current Task

T3. 제약 층 구성

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- [x] 버전 조사 — typescript-eslint peer 때문에 TS 6 채택
- [x] `package.json`·`.nvmrc`·`.gitignore`
- [x] `tsconfig.json`(strict 세트, `@/*` 별칭)
- [x] `vite.config.ts`·`vitest.config.ts`(jsdom)
- [x] `eslint.config.js` — 의존 방향 규칙 4개, `.prettierrc`
- [x] 클린 설치 후 test·typecheck·lint 통과, 경계 규칙 실동작 확인

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`5b7404b`

## Relevant Documents

- `docs/phases/01-project-setup/PLAN.md` T3 · `docs/ARCHITECTURE.md` Dependency Direction · `docs/CONVENTIONS.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `package.json:scripts` · `eslint.config.js:boundary` · `tsconfig.json` · `vitest.config.ts`
