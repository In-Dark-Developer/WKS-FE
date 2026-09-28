# Handoff — chore-unlock-fields-batch

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-27
- Phase / Task: -/-

## Goal

해금 요청이 WKS-BE 계약(`fields` 배열 → `values` 맵)과 맞아 400 이 나지 않는다.

## Work Completed

- 요청 `{ fields: [...] }`, 응답 `{ values, balance }` 로 스키마·클라이언트·목 교체
- 모달에서 고른 항목을 한 요청으로 연다(전부 아니면 전무) — 부분 해금 메시지 삭제
- 해금 실패(503 등) 뒤에도 추천을 다시 읽어 이미 열린 항목을 그린다

## Work In Progress

- 없음

## Files Changed

- `docs/api/openapi.yaml` · `src/api/schema/dating.ts` · `src/api/unlocks.ts` · `src/features/dating/unlock/unlockFlow.ts` · `src/features/dating/recommendation/DatingCardsScreen.tsx` + 테스트

## Decisions Made

- 소유자 지시(2026-09-27): 11/T1 코드를 이 스트림에서 바로 고친다

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · redocly lint

## Test Results

- 619 passed, 경고 없음. openapi 는 기존 1 error·6 warning 그대로

## Known Problems

- 없음

## Unverified Assumptions

- api-dev 실제 서버 호출은 아직 확인하지 않았다

## Exact Next Action

api-dev 에서 카드 해금 한 번 눌러 200 확인.
