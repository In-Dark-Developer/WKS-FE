# Handoff — 01-T5-ci-commands

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-12
- Phase / Task: 01/T5

## Goal

CI 가 PR 마다 `AGENTS.md` Commands 네 개를 실제로 돌린다 — 깨진 코드가 초록으로 통과하지 않는다.

## Work Completed

- `commands` 잡의 placeholder echo 를 실제 명령으로: `pnpm install --frozen-lockfile` → `test` → `typecheck` → `lint`
- `pnpm/action-setup@v6`(packageManager 필드에서 버전 결정) + `actions/setup-node@v7`(`node-version-file: .nvmrc`, `cache: pnpm`)
- `ci.yml` 의 `actions/checkout` 을 v7 로 — v4 는 Node 20 런타임 경고를 낸다
- `tsconfig.json` 에서 `types: ["vitest/globals"]` 제거 (T3 잔재, `globals: true` 없이 들어가 있었다)

## Work In Progress

- 없음

## Files Changed

- `.github/workflows/ci.yml` · `tsconfig.json` · `docs/phases/01-project-setup/PLAN.md`

## Decisions Made

- Node 버전을 워크플로에 적지 않고 `.nvmrc` 에서 읽는다 — 버전이 두 곳에 있으면 갈라진다
- pnpm 버전도 적지 않는다. `pnpm/action-setup` 이 `package.json` 의 `packageManager` 를 읽는다
- 경고를 실패로 만드는 책임은 워크플로가 아니라 스크립트에 둔다(`eslint --max-warnings=0` 등). CI 는 호출만 한다

## Tests Executed

- 로컬 `pnpm typecheck`·`pnpm test`(타입 제거 후 회귀 확인), PR 의 commands 잡

## Test Results

- 로컬 통과. PR 의 commands 잡이 실제 명령으로 초록 (이전에는 echo 라 항상 초록이었다)

## Known Problems

- 작업 커밋이 `commit-msg` 훅에 막혔다 — 허용 type 에 `ci` 가 없다(`feat fix refactor test docs chore ai`). 변경이 부기 커밋 `024da75` 에 딸려 들어갔고 PLAN 의 SHA 를 뒤 커밋에서 고쳤다. CI 변경의 type 을 `chore` 로 쓸지 훅에 `ci` 를 추가할지는 팀 결정
- `flow.yml`·`notion-sync.yml` 은 아직 `actions/checkout@v4` 라 Node 20 경고가 남는다 — 이 Task 의 Touches 밖

## Unverified Assumptions

- ubuntu-latest 러너에 Node 26 이 setup-node 로 설치된다 — 이 PR 의 commands 잡이 그대로 검증한다
- pnpm 캐시가 lockfile 기준으로 잡힌다(설치 시간 단축은 확인하지 않았다)

## Exact Next Action

PR 병합 후 Phase 02 T1(토큰)을 연다. 01/T6 은 백엔드 계약 공개(PRD Q3) 대기.
