# Handoff — spec-v1-api-reason-element

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude
- To: 없음
- Date: 2026-09-24
- Phase / Task: -/-

## Goal

openapi 참조본이 BE 에 이미 있는 궁합 이유·잘 맞는 오행을 담고, FR-3 V1 을 맡은 Task 가 있다.

## Work Completed

- `GET /compatibilities/{id}/reason` + `CompatibilityReason{why,together,conflict}` — 404 COMPATIBILITY_NOT_FOUND · 503 LLM_UNAVAILABLE
- `Result.elementMatch`(nullable, 본인 결과에만) + `ElementMatch{element,korean,reason}`
- 궁합 생성 응답·궁합 요약에 `id`, 궁합 요약을 코드 모양 `{id,nickname,score,tier,createdAt}` 으로 — `src/api/schema` 는 이미 이 모양
- ErrorCode 를 ErrorCode.java 와 1:1 로 (COMPATIBILITY_NOT_FOUND·UNAUTHENTICATED·KAKAO_UNAVAILABLE 추가)
- Phase 09 T6 추가 (Owner 이정진)

## Work In Progress

- 없음

## Files Changed

- `docs/api/openapi.yaml` · `docs/phases/09-auth-and-shell/PLAN.md` · `docs/phases/README.md`

## Decisions Made

- 로그인 경로(/auth/kakao·/me)는 넣지 않았다 — BE 가 쿠키 방식으로 다시 바꾸는 중(2026-09-24)
- T6 담당 이정진 — 소유자 지시

## Tests Executed

- `npx @redocly/cli@1 lint docs/api/openapi.yaml` — 1 error·4 warnings, dev 원본과 같은 항목(새로 생긴 것 없음)

## Test Results

- 없음

## Known Problems

- 참조본에 원래 있던 lint 오류 1건(`nullable` 3.1 비호환)은 건드리지 않았다
- 머리의 `security: []` 주석('토큰을 발급하지 않는다')은 V1 로그인이 들어오면 고쳐야 한다

## Unverified Assumptions

- 없음

## Exact Next Action

병합 후 09/T4(궁합 이유 상세)·09/T6(잘 맞는 오행) 스트림을 연다.
