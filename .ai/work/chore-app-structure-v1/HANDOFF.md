# Handoff — chore-app-structure-v1

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-23
- Phase / Task: -/-

## Goal

V1 폴더 구조 제안 중 **기존 코드만 옮기는 부분**을 적용한다 — 라우트 파일 분할, 가드 이름 정리, 결과 화면 개명. 동작은 그대로다.

## Work Completed

- `src/app/routes.tsx`(290줄) → `routes/index.tsx`(합치기만) + `saju.routes.tsx` + `share.routes.tsx` + `map.routes.tsx`
- `src/app/requireSession.ts` → `routes/guards.ts`, `requireSession` → `requireSaju` (`requireMyResultId` 는 그대로)
- `screens/ReadingScreen.tsx` → `screens/HomeScreen.tsx` (V1 에서 이 화면이 홈이다)
- 두 라우트 파일이 함께 쓰는 history state 스키마를 `routes/fromSharedMap.ts` 로 분리
- `docs/ARCHITECTURE.md` State Management 의 등록 지점 문장 갱신

## Work In Progress

- 없음

## Files Changed

- `src/app/routes/` (index·guards·fromSharedMap·saju.routes·share.routes·map.routes, index.test)
- `src/app/screens/HomeScreen.tsx`, `src/app/preview/screens/reading.tsx`, `src/app/RootLayout.tsx`
- `docs/ARCHITECTURE.md`

## Decisions Made

- 옮기기만 하고 동작은 바꾸지 않았다 — 라우트 경로·loader·action·가드 조건 모두 그대로다.
- V1 신규 영역(`features/auth`·`features/dating`, `api/` 신규 파일, `ui/` 신규 컴포넌트)은 만들지 않았다. 구현이 없는 빈 파일은 두지 않는다(CONVENTIONS 9장).
- `/verify`(사전신청 인증 완료)는 결과 화면에 붙은 흐름이라 `saju.routes.tsx` 에 뒀다.

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint`

## Test Results

- 69 파일 371 테스트 통과, typecheck·lint 경고 없음 (테스트는 옮기기 전과 같은 파일이다 — 동작이 그대로임을 이 통과가 보인다)

## Known Problems

- `docs/PRD.md` 34줄과 ADR·Phase 문서에 `src/app/routes.tsx` 가 남아 있다. 과거 기록이거나 내 Touches 밖이라 고치지 않았다.
- `chore-reading-back-always` 스트림이 `routes.tsx`·`routes.test.tsx`·`preview/screens/reading.tsx` 를 함께 만진다 — 파일이 쪼개지므로 병합 충돌이 난다. 먼저 병합되는 쪽 기준으로 나중 스트림이 `git merge main` 으로 받는다.

## Unverified Assumptions

- V1 신규 영역(`features/auth`·`features/dating`·`api/` 신규 파일·`ui/` 신규 컴포넌트)은 만들지 않았다 — 구현이 없는 빈 폴더는 두지 않는다는 판단이며, V1 API 명세가 오면 그때 추가한다.

## Exact Next Action

PR 을 올리고 리뷰를 받는다 (`scripts/ai-end.sh --ready` 출력 사용).
