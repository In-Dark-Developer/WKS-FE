# Handoff — spec-api-dating-email-codes

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-27
- Phase / Task: -/-

## Goal

FE openapi 가 WKS-BE api-spec §10.7 학교 메일 코드 인증 계약과 같다.

## Work Completed

- 발송·확인 두 경로, 요청·응답 스키마 4개, ErrorCode 3개(INVALID_EMAIL_CODE·EMAIL_CODE_RATE_LIMITED·MAIL_UNAVAILABLE) 추가

## Work In Progress

- 없음

## Files Changed

- `docs/api/openapi.yaml`

## Decisions Made

- 백엔드 문서 §10.7 을 그대로 따른다(소유자 지시 2026-09-27). 매직링크(§10.6)는 FE 사본에 넣지 않는다

## Tests Executed

- `redocly lint docs/api/openapi.yaml`

## Test Results

- 변경 전과 같은 기존 1 error(nullable)·6 warning 만 남음 — 새 문제 없음

## Known Problems

- 없음

## Unverified Assumptions

- 없음

## Exact Next Action

없음 — 병합 후 10/T1·T5 가 이 계약을 쓴다.
