# Handoff — chore-app-structure-v1

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-23
- Phase / Task: -/-

## Goal

V1 폴더 구조 제안 중 **기존 코드만 옮기는 부분**을 적용한다 — 라우트 파일 분할, 가드 이름 정리, 결과 화면 개명. 동작은 그대로다.

## Work Completed

- 없음

## Work In Progress

- step 1 진행 중: `requireSession.ts` → `routes/guards.ts`

## Files Changed

- 없음

## Decisions Made

- 없음

## Tests Executed

- 없음

## Test Results

- 없음

## Known Problems

- `chore-reading-back-always` 스트림이 `routes.tsx`·`routes.test.tsx`·`preview/screens/reading.tsx` 를 함께 만진다 — 파일이 쪼개지므로 병합 충돌이 난다. 먼저 병합되는 쪽 기준으로 나중 스트림이 `git merge main` 으로 받는다.

## Unverified Assumptions

- V1 신규 영역(`features/auth`·`features/dating`·`api/` 신규 파일·`ui/` 신규 컴포넌트)은 만들지 않았다 — 구현이 없는 빈 폴더는 두지 않는다는 판단이며, V1 API 명세가 오면 그때 추가한다.

## Exact Next Action

`pnpm test`·`pnpm typecheck`·`pnpm lint` 를 돌려 분할 결과를 확인한다.
