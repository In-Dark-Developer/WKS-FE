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

- 없음


## Files Changed

- `src/api/session.ts`·`.test.ts` · `src/api/results.ts`·`.test.ts` · `src/api/client.ts`·`.test.ts` · `src/app/requireSession.ts` · `src/app/routes.tsx`·`routes.test.tsx`


## Decisions Made

- `requireSession(params.id)` 는 보관값이 없으면 id 유무와 무관하게 막는다 · 라우트 테스트 주소 id 를 UUID 로(보관값이 UUID 로만 파싱)


## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · 목 모드 dev 서버 · 운영 API 1회 제출(소유자 승인) — 로컬 Vite 에 `/api` → `https://api.threadoffate.site` 프록시(Origin 제거, 설정은 scratchpad·저장소 밖). 운영 CORS 가 localhost 를 403 으로 막아서다


## Test Results

- 55 files / 258 tests · typecheck · lint(경고 0) 통과
- 운영: `POST /api/results` 201 → `/reading/1ad9f001-21bf-4952-9448-8603dbe6e82e` → `GET` 200, 결과·인연카드 화면 표시, 새로고침 유지, 보관값 삭제 후 카드 주소 → `/`, 콘솔 에러 없음. 운영 DB 에 닉네임 `T8확인` 결과 1건이 남았다


## Known Problems

- 구현 커밋 55dc225 에 `Wip:` trailer 가 남아 있다(push 뒤라 rewrite 하지 않음) — 이후 운영 검증으로 완료, PLAN 에 그 SHA 를 적었다


## Unverified Assumptions

- 없음

## Exact Next Action

`git merge origin/main` → `scripts/ai-end.sh --ready` → 소유자 확인 후 PR 생성.
