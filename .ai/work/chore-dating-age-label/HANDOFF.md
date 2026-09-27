# Handoff — chore-dating-age-label

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-27
- Phase / Task: -/-

## Goal

카드 나이 칸이 서버의 age 문구를 그대로 보인다.

## Work Completed

- `age: string | null` (예: `03년생`), 생년월일 변환 삭제

## Work In Progress

- 없음

## Files Changed

- `docs/api/openapi.yaml` · `src/api/schema/{dating,matchRequests}.ts` · `src/api/{dating,matchRequests}.ts` · `src/features/dating/{recommendation,requests}/*Loader.ts` + 테스트

## Decisions Made

- 2026-09-27 백엔드 연락: 나이는 서버가 계산해 문자열 `00년생` 으로 준다

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · redocly

## Test Results

- 625 passed, 경고 없음

## Known Problems

- 없음

## Unverified Assumptions

- 없음

## Exact Next Action

없음
