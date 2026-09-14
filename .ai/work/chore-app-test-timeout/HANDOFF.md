# Handoff — chore-app-test-timeout

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-14
- Phase / Task: -/-

## Goal

`main` 의 `pnpm test` 가 `/preview` lazy 라우트 로딩이 느린 환경에서도 `App.test.tsx` 로 실패하지 않는다.

## Work Completed

- `/preview` 테스트: `findByRole` 대기 1초 → 10초, 테스트 제한 5초(기본) → 15초

## Work In Progress

- 없음

## Files Changed

- `src/app/App.test.tsx`

## Decisions Made

- 로딩 자체(eager glob)는 건드리지 않고 테스트 대기만 늘림 (소유자 지시). `findByRole` 만 늘리면 vitest 기본 5초 제한에 먼저 끊겨 테스트 timeout 도 함께 늘림

## Tests Executed

- `pnpm test`, `pnpm typecheck`, `pnpm lint`
- lazy 로더에 6초 지연을 임시로 넣고 수정 전후 `App.test.tsx` 비교(지연은 되돌림)

## Test Results

- 238 passed, typecheck·lint 통과
- 6초 지연: 수정 전 `Unable to find role="heading"` 실패, 수정 후 통과

## Known Problems

- 이 머신에서는 원래 실패가 재현되지 않음(109ms). 미리보기 화면이 늘면 로딩은 계속 느려짐 — 근본 해결은 `previewScreens.ts` glob 을 `eager: false` 로(사용처 비동기화 필요)

## Unverified Assumptions

- 없음

## Exact Next Action

PR 리뷰 반영
