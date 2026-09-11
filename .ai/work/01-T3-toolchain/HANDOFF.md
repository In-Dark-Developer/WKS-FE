# Handoff — 01-T3-toolchain

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-12
- Phase / Task: 01/T3

## Goal

클린 체크아웃에서 `pnpm install --frozen-lockfile` → `test` → `typecheck` → `lint` 가 경고 없이 통과한다.

## Work Completed

- `package.json` — pnpm 11.22.0 고정, 스크립트 `dev`·`build`·`test`·`typecheck`·`lint`, 의존성 전부 정확한 버전으로 핀
- `.nvmrc`(26), `.gitignore`에 Node 항목, `pnpm-lock.yaml` 커밋
- `tsconfig.json` — strict · noUncheckedIndexedAccess · verbatimModuleSyntax · noUnused* · `@/* → ./src/*`
- `vite.config.ts`(React + Tailwind 4 플러그인), `vitest.config.ts`(jsdom, vite 설정 병합)
- `eslint.config.js` — ARCHITECTURE 의존 방향을 `no-restricted-imports` 4개 그룹으로 옮김, `.prettierrc`

## Work In Progress

- 없음

## Files Changed

- `package.json` `pnpm-lock.yaml` `.nvmrc` `tsconfig.json` `vite.config.ts` `vitest.config.ts` `eslint.config.js` `.prettierrc` `.gitignore`

## Decisions Made

- **TypeScript 6.0.3** (최신은 7.0.2). typescript-eslint 8.70의 peer가 `>=4.8.4 <6.1.0` — TS 7을 쓰면 린트가 안 돈다. TS 7은 typescript-eslint가 지원할 때 올린다
- **zod 4.5.4** (최신 4.6.2). pnpm 11의 minimumReleaseAge 게이트에 걸려 4.6.2는 `pnpm-workspace.yaml` 예외 등록을 요구했다. 갓 올라온 버전을 예외로 빼느니 하루 지난 버전을 쓴다(공급망 보호를 끄지 않는다)
- `baseUrl`은 TS 6에서 deprecated 오류 — `paths`만 `./src/*`로 쓴다
- **prettier는 코드만 검사한다**(`src`·`tests`·루트 설정 파일). `docs/`·`.ai/`의 한글 마크다운까지 넣으면 표와 줄바꿈을 전부 다시 쓴다
- `test`는 당분간 `--passWithNoTests` — 테스트 파일은 T4가 넣는다
- `vitest.config.ts`에 `setupFiles`를 아직 두지 않았다. `tests/setup.ts`는 T4 소유라 여기서 만들지 않는다

## Tests Executed

- `rm -rf node_modules` 후 `pnpm install --frozen-lockfile` → `pnpm test` → `pnpm typecheck` → `pnpm lint`
- 경계 규칙 실동작: `src/ui`에서 `@/api/*`, `src/features/a`에서 `@/features/b/*`를 import 하는 임시 파일로 확인(확인 후 삭제)

## Test Results

- 네 명령 모두 경고 없이 통과. 경계 규칙은 두 경우 모두 error 로 잡혔다

## Known Problems

- `pnpm build`는 아직 실패한다 — `index.html`과 진입 파일이 없다(T4). PLAN의 Done when 네 명령에는 build가 없다. 작업 중 지운 `src/.gitkeep`은 원본 그대로 복원했다
- Tailwind 4는 CSS-first다. Phase 02 T1의 Touches에 있는 `tailwind.config.ts`가 필요 없을 수 있다 — 그 Task 소유자가 판단하면 된다

## Unverified Assumptions

- CI 러너(ubuntu-latest)에서도 Node 26·pnpm 11.22로 같은 결과가 나온다 — T5에서 실제로 확인된다
- `@types/node`의 dist-tag latest가 22.x라 26.5.1을 직접 지정했다. Node 26 타입이 맞다고 가정

## Exact Next Action

PR을 올려 병합하고 01/T4(@nicerjs23)를 연다 — `src/` 전체를 잡는 Task라 먼저 끝내야 Phase 02·03이 출발한다.
