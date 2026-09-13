# Handoff — 02-T5-app-shell-route

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: codex
- To: 없음
- Date: 2026-09-13
- Phase / Task: 02/T5

## Goal

모든 라우트가 공통 AppShell 안에서 렌더되고 localhost의 360·375·430px 폭에서 실제 레이아웃 치수가 확인된다.

## Work Completed

- PR #39로 AppShell 구현이 main에 병합됨.
- `App`이 모든 라우트를 `AppShell` 안에 렌더하도록 연결함.
- localhost를 Codex 브라우저에서 360·375·430·1024px로 실측함.

## Work In Progress

- 없음

## Files Changed

- `src/app/App.tsx`
- `src/app/App.test.tsx`

## Decisions Made

- 라우트 배열 소유권을 침범하지 않고 최상위 `App`에서 `RouterProvider`를 합성함.

## Tests Executed

- `pnpm test`
- `pnpm typecheck`
- `pnpm lint`
- `git diff --check`
- Codex 브라우저 `localhost:5173` viewport 360·375·430·1024px

## Test Results

- 9개 테스트 파일·32개 테스트, 타입·린트·포맷·공백 검사 통과.
- 360·375·430px 가로 넘침 0; 375px 콘텐츠 343px; 1024px에서 430px 셸 x=297px.
- 고정 배경·별 애니메이션 확인, 브라우저 경고·오류 없음.

## Known Problems

- 현재 루트는 Phase 03 전 임시 `운꿰사` 제목만 렌더한다.

## Unverified Assumptions

- 없음

## Exact Next Action

PR에서 전역 라우트 합성과 폭별 실측 결과를 검토한다.
