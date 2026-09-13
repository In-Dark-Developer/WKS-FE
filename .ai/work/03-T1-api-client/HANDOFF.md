# Handoff — 03-T1-api-client

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-13
- Phase / Task: 03/T1

## Goal

`src/api/client.ts`·`results.ts`·`schema/`가 `POST /results`·`GET /results/{id}`를 zod 경계 검증(요청·응답)과 함께 호출하고, 스키마 위반·네트워크 실패·`error.code`(404·503 등)를 타입으로 구분해 돌려주며, 백엔드 GET 미구현 구간을 메울 목 응답 경로가 있고, 전체가 테스트·typecheck·lint를 통과한다.

## Work Completed

- `src/api/schema/envelope.ts`·`result.ts`: `{success,data|error}` 봉투·`ErrorCode`(9개)·`ResultRequest`·`Result`·`ResultDetail` zod 스키마
- `src/api/client.ts`: `request()` — 토큰(`Authorization: Bearer`) 헤더, GET 1회 재시도(POST 없음), 응답을 `{ok:true,data} | {ok:false,error:{kind:'network'|'schema'|'api',...}}`로 타입 구분, `INVALID_TOKEN`이면 `clearSession()`
- `src/api/results.ts`: `createResult`·`getResult` + `VITE_API_MOCK=true`일 때 쓰는 목 응답(백엔드 dev에 GET 미구현이라 필요)
- `vite.config.ts` server.port 3000(백엔드 CORS), `src/vite-env.d.ts`(env 타입, Touches 밖 — 아래 Known Problems)

## Work In Progress

- 없음 — 구현·테스트 끝, PR만 남음

## Files Changed

- `src/api/client.ts`, `src/api/client.test.ts`, `src/api/results.ts`, `src/api/results.test.ts`
- `src/api/schema/envelope.ts`, `src/api/schema/result.ts`, `src/api/schema/result.test.ts`
- `vite.config.ts`, `src/vite-env.d.ts` (신규)

## Decisions Made

- 요청/응답 타입 구분은 discriminated union 반환값으로 했다(throw 아님) — SajuForm처럼 호출자가 `{formError:'connection'}` 식으로 화면에 그대로 쓸 수 있게
- `VITE_API_MOCK` 플래그로 목/실서버를 전환한다(자동 폴백 아님) — 진짜 404와 "라우트 자체가 없음"을 섞지 않으려고

## Tests Executed

- `pnpm test` (전체 28개 파일), `pnpm typecheck`, `pnpm lint`, `pnpm build`

## Test Results

- 135/135 통과, typecheck·lint·build 전부 통과 (commit 46d150a)

## Known Problems

- `src/vite-env.d.ts`는 CURRENT Touches 목록에 없었다 — `client.ts`의 `VITE_` env 타입에 필요해 추가했다(순수 타입 선언, 동작 없음). 소유자 확인 필요
- `SajuInput`(03/T4)에는 계약에 없는 `calendarType`·`isLeapMonth`가 있고 `birthRegion`이 없다 — `SajuInput → ResultRequest` 변환은 이 Task Touches 밖(routes.tsx action, T3 소유)이라 손대지 않았다. 다음 사람이 이 변환에서 두 필드를 드롭하고 `birthRegion: null`을 채워야 한다(PRD Q3 답 전까지)

## Unverified Assumptions

- `INVALID_TOKEN` 에러 코드를 세션 무효 신호로 가정했다(PRD Q16 미확정) — 답이 오면 client.ts의 이 분기를 실제 코드로 바꾼다

## Exact Next Action

`.ai/local/notes/03-T1-api-client.md` 작성해 소유자에게 보여주고, 승인되면 `scripts/ai-end.sh --ready`로 PR 초안을 연다.
