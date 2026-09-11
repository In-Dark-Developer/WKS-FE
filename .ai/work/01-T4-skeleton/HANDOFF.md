# Handoff — 01-T4-skeleton

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-12
- Phase / Task: 01/T4

## Goal

`pnpm dev` 로 라우팅된 화면이 뜨고 테스트 1개가 통과한다 — Phase 02·03 이 출발할 수 있다.

## Work Completed

- `index.html`, `src/main.tsx`(StrictMode + createRoot)
- `src/app/App.tsx` — `createBrowserRouter` + `RouterProvider`, `src/app/routes.tsx` — 라우트 배열 한 곳
- `src/app/Placeholder.tsx` — Phase 03 이 화면을 넣기 전까지의 빈 화면
- `tests/setup.ts`(jest-dom 매처)와 `vitest.config.ts` 의 `setupFiles` 연결
- `src/app/routes.test.tsx` — `createMemoryRouter` 로 루트 경로 렌더 확인

## Work In Progress

- 없음

## Files Changed

- `index.html` · `src/main.tsx` · `src/app/{App,routes,Placeholder}.tsx` · `src/app/routes.test.tsx` · `tests/setup.ts` · `vitest.config.ts` · `tsconfig.json`

## Decisions Made

- 빈 화면을 `src/features/` 가 아니라 `src/app/Placeholder.tsx` 에 뒀다 — `features/` 는 Phase 03 소유라 지금 손대지 않는다
- `routes.tsx` 를 배열 한 곳으로 모았다. Phase 03 T3 이 이 파일을 단독 소유하며 각 화면은 컴포넌트만 export 한다
- `vitest.config.ts` 의 `./vite.config` import 가 Vite 경고를 냈다 → `./vite.config.ts` 로 바꾸고 `allowImportingTsExtensions: true`(noEmit 이라 안전). 경고 없이 통과가 기준이라 tsconfig 를 Touches 에 추가했다
- 테스트는 컨벤션대로 대상 옆(`src/app/routes.test.tsx`)에 뒀다. `tests/` 에는 설정만 둔다

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · `pnpm build` · `pnpm dev --port 5199` 후 브라우저에서 접근성 트리 확인

## Test Results

- 테스트 1개 통과, typecheck·lint 무경고, build 성공
- dev 서버에서 `heading "운꿰사"` 렌더 확인 (React 가 실제로 마운트된다)
- 번들: 312.09 kB raw / **98.71 kB gzip** — NFR-2 의 250KB(gzip) 예산 대비 여유 있음

## Known Problems

- `tsconfig.json` 의 `types: ["vitest/globals"]` 는 `globals: true` 없이 들어가 있다(T3 잔재). 지금은 테스트가 `vitest` 에서 직접 import 해서 문제 없지만, 전역을 쓰면 런타임에서 깨진다 — 정리하려면 T3 파일을 손대야 한다
- `Placeholder.tsx` 는 Phase 03 T3 이 인트로를 넣으면 삭제한다

## Unverified Assumptions

- SPA 라우팅이라 배포 시 fallback(모든 경로 → index.html) 설정이 필요하다 — 호스팅은 Phase 08 에서 정한다
- 번들 예산은 의존성이 거의 없는 지금 기준이다. 화면이 붙으면 다시 잰다

## Exact Next Action

PR 병합 후 01/T5(CI)와 Phase 02 T1(토큰)을 연다 — src/ 가 풀렸으므로 병렬 가능.
