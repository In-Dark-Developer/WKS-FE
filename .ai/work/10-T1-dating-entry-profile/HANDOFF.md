# Handoff — 10-T1-dating-entry-profile

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: @nicerjs23 (claude-code)
- To: @jjjung0921 (Phase 10 Lead · src/app/ Owner — PR 리뷰)
- Date: 2026-09-24
- Phase / Task: 10/T1

## Goal

소개팅 탭이 `GET /me` 로 비로그인·사주 없음·프로필 없음·등록 완료를 갈라 인트로·프로필 (1/2)·(2/2)·Top 3 자리로 보내고, 프로필 두 단계가 검증·오류·연결 실패 상태를 가진 채 저장까지 목 데이터로 끝난다.

## Work Completed

- 없음

## Work In Progress

- CURRENT Progress 1~7. 소유자 지시(2026-09-24): 백엔드 dating 명세 전이라 목 데이터(`VITE_API_MOCK=true`)로 진행. Touches 에 `src/api/` 추가 승인.

## Files Changed

- 없음

## Decisions Made

- 로그인 토큰·카카오 인가는 09/T2(Feat/Login) 소관 — 이 스트림은 `auth.ts`·`authToken.ts`·`client.ts` 를 건드리지 않고, 목 모드의 로그인 상태만 `me.ts` 안에 둔다.

## Tests Executed

- 없음

## Test Results

- 없음

## Known Problems

- 인증 방식 불일치: 백엔드 api.md §6 은 `Authorization: Bearer`(쿠키 미사용), 저장소 NFR-7·ARCHITECTURE·ADR-20260923-v1-account 는 HttpOnly 쿠키. spec PR 필요 — 09/T2·Lead 판단.
- `/api/dating/**` 명세 없음 — 프로필 저장·사진 업로드의 실제 호출은 명세 뒤에 채운다.

## Unverified Assumptions

- 없음

## Exact Next Action

CURRENT Progress 1 — `src/api/schema/me.ts`·`src/api/me.ts`.
