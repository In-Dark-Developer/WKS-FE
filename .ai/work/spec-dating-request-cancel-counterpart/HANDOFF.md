# Handoff — spec-dating-request-cancel-counterpart

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-27
- Phase / Task: -/-

## Goal

`docs/api/openapi.yaml` 이 WKS-BE dev 4d2e534 의 요청 취소 API 와 요청 목록 counterpart 를 반영한다.

## Work Completed

- openapi: CANCELLED 상태, 취소 경로, 목록 행 `DatingRequestListItem`·`DatingRequestCounterpart`
- 공지 `2026-09-27-dating-request-cancelled`

## Work In Progress

- 없음

## Files Changed

- `docs/api/openapi.yaml`
- `.ai/team/announcements/2026-09-27-dating-request-cancelled.md`

## Decisions Made

- 목록 전용 counterpart 는 `DatingRequest` 를 allOf 로 확장한 별도 스키마로 둔다 — BE 도 생성·수락·거절·취소 응답과 목록 DTO 를 나눴다

## Tests Executed

- redocly lint(변경 전후) · pnpm test · typecheck · lint

## Test Results

- lint 결과 변경 전후 동일(기존 1 error·6 warn) · test 565 통과 · typecheck·lint 통과

## Known Problems

- FE zod enum 에 CANCELLED 가 없어 취소 이력이 생기면 요청 목록 파싱이 실패한다 — 11/T2 후속에서 고친다

## Unverified Assumptions

- 없음

## Exact Next Action

PR 병합 후 11/T2 후속 스트림에서 zod·취소 연결·counterpart 매핑을 반영한다.
