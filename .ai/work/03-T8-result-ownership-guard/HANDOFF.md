# Handoff — 03-T8-result-ownership-guard

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-14
- Phase / Task: 03/T8

## Goal

보관된 `resultId` 가 결과·인연카드 가드의 기준이 되어, 실제 백엔드로 입력 → 결과 → 인연카드를 이탈 없이 완주한다(03/T8 Done when).

## Work Completed

- `session.ts` 값 `{ v: 2, resultId: uuid }`, `writeSession(resultId)` · 목 응답의 가짜 토큰 쓰기 삭제
- `createResult` 가 목·실제 공통으로 성공 시 `writeSession(data.resultId)`
- `client.ts` Authorization 헤더·`INVALID_TOKEN` 세션 삭제 제거
- `requireSession(params.id)` — 보관값 없음·다름이면 `/` · 결과·인연카드 loader 적용
- 테스트: session v1 값 삭제·덮어쓰기, createResult 성공/실패 저장, 헤더 없음, 불일치 redirect(결과·카드) (commit 55dc225, WIP)


## Work In Progress

- 실제 백엔드 완주 검증만 남음 — 소유자 확인 대기


## Files Changed

- `src/api/session.ts`·`.test.ts` · `src/api/results.ts`·`.test.ts` · `src/api/client.ts`·`.test.ts` · `src/app/requireSession.ts` · `src/app/routes.tsx`·`routes.test.tsx`


## Decisions Made

- `requireSession` 인자는 `string | undefined`(params.id) — 보관값이 없으면 id 가 없어도 막는다
- 라우트 테스트의 주소 id 를 UUID 로 바꿨다 — 보관값이 UUID 로만 파싱된다


## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint`
- 목 모드 dev 서버(워크스페이스 `.claude/launch.json` `wks-fe-mock`, 저장소 밖): 예전 v1 값이 있는 상태에서 입력 → 결과 → 인연카드, 다른 UUID 주소·보관값 삭제 후 카드 주소


## Test Results

- 55 files / 258 tests 통과, typecheck·lint(경고 0) 통과
- 목 모드: `/reading/<id>` 진입, `wks:session` 이 `{v:2,resultId}` 로 교체, 카드 화면 표시, 불일치·보관값 없음은 `/`, 콘솔 에러 없음


## Known Problems

- 03 AC1(실제 백엔드 완주) 미검증


## Unverified Assumptions

- 없음

## Exact Next Action

소유자 확인 후 실제 백엔드로 입력 → 결과 → 인연카드 1회 완주, 다른 브라우저에서 결과 주소 → `/` 확인. 통과하면 PLAN T8 `[x]`+SHA, `git merge main` → `scripts/ai-end.sh --ready`.
