# Handoff — 09-T3-account-restore

- From: claude-code
- To: 없음
- Date: 2026-09-25
- Phase / Task: 09/T3

## Goal

로그인하면 계정 결과가 브라우저 세션을 이기고(없으면 브라우저 결과가 계정에 연결), 시작 화면으로 돌아오며, 취소·실패해도 비로그인 기록이 남는다.

## Work Completed

- `features/auth/kakaoLogin.ts` — 로그인 성공 시 `restoredResultId` 가 있으면 세션을 교체하고 복귀 경로의 옛 resultId(`/reading/:id`)를 새 값으로 바꾼다. 실패·취소는 세션을 건드리지 않는다
- 연결은 백엔드가 한다 — 로그인 요청에 브라우저 resultId 를 보내는 것은 T2 에서 이미 함
- `api/me.ts`·`api/auth.ts` 목 계정에 계정 결과(resultId)를 두고 BE §9 연결·복원 규칙을 흉내 낸다(로그아웃해도 계정 결과는 남음)

## Work In Progress

- 없음

## Files Changed

- `src/features/auth/kakaoLogin.ts(+test)` · `src/api/auth.ts(+test)` · `src/api/me.ts(+test)`

## Decisions Made

- 복원은 로그인 응답의 `restoredResultId` 로 한다(`GET /me/result` 추가 왕복 없음) — BE §9 가 둘이 같은 결과라고 보장한다.

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · 목 모드 브라우저: 계정 결과 있음·브라우저 세션 없음 → 로그인 → 세션이 계정 결과로 채워지고 /dating 복귀

## Test Results

- 전부 통과

## Known Problems

- 실제 모드 미검증(BE 쿠키 전환 대기) — PLAN T3 미체크.
- FR-20 의 궁합지도 '로그인하고 저장하기' CTA(비로그인만 노출)는 PLAN 에 담당 Task 가 없고 디자인(기능명세서 4.9) 확인이 필요해 넣지 않았다.
- 로그인 상태에서 기기에 쿠키는 있고 `wks:session` 만 지워진 경우 `GET /me/result` 로 되살리는 경로는 없다.

## Unverified Assumptions

- 없음

## Exact Next Action

BE 쿠키 전환 후 실제 모드로 연결·복원을 확인하고 PLAN T3 를 체크한다.
