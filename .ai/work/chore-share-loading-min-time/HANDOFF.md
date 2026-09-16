# Handoff — chore-share-loading-min-time

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: @nicerjs23 (claude-code)
- To: @jjjung0921 (`src/app/` Owner — 리뷰. `chore-reading-back-always` 가 같은 파일을 만진다)
- Date: 2026-09-17
- Phase / Task: -/-

## Goal

공유 링크로 들어온 사람이 궁합 대기 화면을 최소 1.5초는 본다(궁합이 금방 만들어져도).

## Work Completed

- `shareEntryLoader` 로 `/s/:shareId`·`/s/:shareId/join` loader 를 감싸 최소 1.5초 유지

## Work In Progress

- 없음 (소유자 push 승인 대기)

## Files Changed

- `src/app/routes.tsx` · `src/app/routes.test.tsx`

## Decisions Made

- 기다림은 라우트 조립(app)에 뒀다 — friends loader 를 그대로 두어 loader 테스트 14개가 느려지지 않는다
- `finally` 에서 기다린다 — 정상 경로가 redirect 를 던지므로 `Promise.all` 로는 기다려지지 않는다
- 보관된 결과가 있는 사람만 기다린다 — 대기 화면을 보지 않는 첫 방문자는 그대로 빠르다

## Tests Executed

- `pnpm test`·`typecheck`·`lint`
- 목 dev + playwright 로 대기 화면이 보인 시간, 첫 방문자 진입 시간 측정

## Test Results

- 전체 통과. 공유 링크 첫 진입 대기 화면 1970ms 노출(최소 1.5초 + 지도 조회), 첫 방문자는 113ms 로 입력 화면(대기 화면 없음)
- 최소 대기로 1초를 넘긴 기존 테스트 2개는 `findBy` 대기 시간을 3초로 늘렸다

## Known Problems

- `chore-reading-back-always`(@jjjung0921)가 `routes.tsx`·`routes.test.tsx` 를 함께 만진다 — 나중에 병합하는 쪽이 `git merge main` 으로 받는다

## Unverified Assumptions

- 없음

## Exact Next Action

소유자 승인 → push → PR.
