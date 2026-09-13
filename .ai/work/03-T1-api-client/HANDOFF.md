# Handoff — 03-T1-api-client

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-13
- Phase / Task: 03/T1

## Goal

`src/api/client.ts`·`results.ts`·`schema/`가 `POST /results`·`GET /results/{id}`를 zod 경계 검증(요청·응답)과 함께 호출하고, 스키마 위반·네트워크 실패·`error.code`(404·503 등)를 타입으로 구분해 돌려주며, 백엔드 GET 미구현 구간을 메울 목 응답 경로가 있고, 전체가 테스트·typecheck·lint를 통과한다.

## Work Completed

- `src/api/schema/envelope.ts`·`result.ts`: `{success,data|error}` 봉투·`ErrorCode`(9개)·`ResultRequest`·통합 `Result`(shareId·zodiac·compatibilities 포함) zod 스키마
- `src/api/client.ts`: `request()` — 토큰(`Authorization: Bearer`) 헤더, GET 1회 재시도(POST 없음), 응답을 `{ok:true,data} | {ok:false,error:{kind:'network'|'schema'|'api',...}}`로 타입 구분, `INVALID_TOKEN`이면 `clearSession()`
- `src/api/results.ts`: `createResult`·`getResult` + `VITE_API_MOCK=true`일 때 쓰는 목 응답
- `vite.config.ts` server.port 3000, `src/vite-env.d.ts`(env 타입, Touches 밖 — 소유자 확인 필요)
- (2차) main 재동기화 중 `docs/api/openapi.yaml` 0.2.0(WKS-BE b61f849) 유입 — 스키마를 계약대로 다시 맞춤: `calendarType`·`isLeapMonth` 추가, `birthRegion` 삭제, `Result`에 `shareId`·`zodiac`·`compatibilities`, `grade` SS~B 6단계

## Work In Progress

- 없음 — 구현·테스트 끝, push·PR 승인 대기

## Files Changed

- `src/api/client.ts`, `.test.ts`, `src/api/results.ts`, `.test.ts`, `src/api/schema/envelope.ts`, `result.ts`, `.test.ts`
- `vite.config.ts`, `src/vite-env.d.ts`(신규)

## Decisions Made

- 요청/응답 타입 구분은 discriminated union 반환값으로 했다(throw 아님) — action이 `{formError:'connection'}` 식으로 화면에 그대로 쓸 수 있게
- `VITE_API_MOCK` 플래그로 목/실서버를 전환한다(자동 폴백 아님) — 진짜 404와 "계약 밖 경로"를 안 섞으려고

## Tests Executed

- `pnpm test`(28개 파일)·`typecheck`·`lint`·`build`, 계약 갱신 후 재실행

## Test Results

- 137/137 통과, typecheck·lint·build 전부 통과 (commit 46d150a, 78fd74e)

## Known Problems

- `src/vite-env.d.ts` Touches 밖 추가(순수 타입, 동작 없음) — 소유자 확인 필요
- 좋은 소식: 계약 갱신으로 03/T4 `SajuInput`(calendarType·isLeapMonth 있음, birthRegion 없음)이 이제 `ResultRequest`와 거의 동일한 모양이라 03/T7 연동이 더 쉬워짐

## Unverified Assumptions

- `INVALID_TOKEN` 에러 코드를 세션 무효 신호로 가정했다(PRD Q16 미확정)

## Exact Next Action

소유자 push 승인 → `scripts/ai-end.sh --ready`로 PR 초안. 병합 후 다음 Task는 03/T7(입력·결과 연동, PLAN 재편으로 T5 대신 배정됨).
