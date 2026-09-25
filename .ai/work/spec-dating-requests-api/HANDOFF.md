# Handoff — spec-dating-requests-api

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-26
- Phase / Task: -/-

## Goal

FE `openapi.yaml` 참조본이 WKS-BE 소개팅 매칭 요청·보관함 계약(api-spec §11, dev 8827766)과 같아져 11/T2 가 연결을 시작할 수 있다.

## Work Completed

- `/dating/requests` POST·GET(box=sent|received) · `/dating/requests/{requestId}/accept`·`/reject` 추가
- 스키마 `DatingRequest`·`DatingRequestStatus` 추가 — BE `DatingRequestResponse`·`DatingRequestService` 코드와 대조(에러 코드·409 조건)

## Work In Progress

- 없음

## Files Changed

- `docs/api/openapi.yaml`

## Decisions Made

- BE 계약을 있는 그대로 옮기고, FR-30 과 어긋나는 점은 계약에 넣지 않고 주석·Known Problems 로 남겼다

## Tests Executed

- `npx @redocly/cli@1 lint docs/api/openapi.yaml` 변경 전·후 비교, `bundle --dereferenced` 로 새 경로 확인

## Test Results

- 전·후 모두 1 error·5 warning(기존: info·servers·signups/verify·auth/logout·health) — 새 문제 없음

## Known Problems

BE 계약과 FR-30 의 차이 — 백엔드(곽도윤·최선우)에 문의할 것:
- 목록 행에 상대 프로필(이름·사진·학과·MBTI·자기소개·점수)이 없다 — 요청함 화면(11/T3 퍼블리싱)과 FR-30 '받은 신청은 해금 없이 전부 공개' 에 필요
- '요청 취소'(보낸 사람, 응답 전) API 가 없다
- '매칭에 실패했어요'(상대가 다른 사람과 맺어짐) 상태가 없다 — BE 는 수락이 다른 요청을 바꾸지 않는다
- 학교 메일 인증 연동 전이라 추천 조회가 403 — 실제 흐름은 목 모드로만 확인 가능

## Unverified Assumptions

- 없음

## Exact Next Action

PR 병합 뒤 11/T2 스트림을 열고 `src/api/dating.ts` 에 요청 함수 추가(목 포함)
