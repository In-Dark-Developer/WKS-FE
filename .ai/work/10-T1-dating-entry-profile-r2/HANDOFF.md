# Handoff — 10-T1-dating-entry-profile-r2

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: @nicerjs23 (claude-code)
- To: @jjjung0921 (Phase 10 Lead · src/app/ Owner — PR 리뷰)
- Date: 2026-09-25
- Phase / Task: 10/T1

## Goal

#200 이 가안으로 둔 프로필 저장·사진 업로드를 WKS-BE 가 실제로 구현한 계약(api-spec.md §10, dev 5ec80d2)에 맞춘다.

## Work Completed

- 없음

## Work In Progress

- CURRENT Progress 1~4. BE 가 9/24~25 에 소개팅 프로필·추천·요청을 구현했다(#85·#87) — 가정이 아니라 실제 계약으로 고친다.

## Files Changed

- 없음

## Decisions Made

- 없음

## Tests Executed

- 없음

## Test Results

- 없음

## Known Problems

- BE `/dating/**` 은 `Authorization: Bearer` 인데 FE 는 쿠키 계약을 가정했다(#205 · 공지 2026-09-25-cookie-auth-contract) — 전환 전까지 실제 모드로 부를 수 없다
- 실(`/api/wallet/**`)·리롤·해금은 BE 미구현(api-spec.md §10 '#84 구현 상태') — 10/T2·T3 는 여전히 가정이 필요하다
- `GET /dating/recommendations` 는 학교 메일 인증 연동 전까지 `DATING_NOT_VERIFIED` 403

## Unverified Assumptions

- 없음

## Exact Next Action

CURRENT Progress 1 — openapi.yaml 에 `/dating/profile/photo`·`/dating/profile`·`/dating/profile/me` 와 DATING_* 에러 코드를 넣는다.
