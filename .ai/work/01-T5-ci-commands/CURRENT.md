# Current State — 01-T5-ci-commands

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 01-T5-ci-commands
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/01-T5-ci-commands
- Task: 01/T5
- Touches: .github/workflows/ci.yml,tsconfig.json,docs/phases/01-project-setup/PLAN.md
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-notion-board-sync, 2026-09-12-board-rows-for-streams

## Current Phase

01-project-setup — `docs/phases/01-project-setup/PLAN.md`

## Current Task

T5. CI에서 Commands 실행

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- [x] commands 잡을 실제 pnpm 명령으로 (install → test → typecheck → lint)
- [x] pnpm/action-setup + setup-node(`.nvmrc`, pnpm 캐시)
- [x] ci.yml 의 actions 를 Node 20 런타임 경고 없는 버전으로
- [x] T3 잔재 `types: ["vitest/globals"]` 제거

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`175993f`

## Relevant Documents

- `docs/phases/01-project-setup/PLAN.md` T5 · `AGENTS.md` Commands

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `.github/workflows/ci.yml:commands` · `tsconfig.json`
