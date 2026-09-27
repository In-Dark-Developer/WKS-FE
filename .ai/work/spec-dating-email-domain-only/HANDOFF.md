# Handoff — spec-dating-email-domain-only

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-27
- Phase / Task: -/-

## Goal

spec 이 "V1 은 @dgu.ac.kr 도메인만 확인, 코드 인증은 이후 버전용" 결정과 맞는다.

## Work Completed

- PRD FR-25 문구·Q20 삭제, openapi 프로필 등록 403 삭제·400 INVALID_EMAIL_DOMAIN, email-codes 를 V1 미사용 표시, PLAN T5 재정의

## Work In Progress

- 없음

## Files Changed

- `docs/prd/30-functional-requirements.md` · `docs/prd/50-scope.md` · `docs/api/openapi.yaml` · `docs/phases/10-dating-onboarding/PLAN.md`

## Decisions Made

- 2026-09-27 소유자: V1 은 도메인만 확인, 코드 인증 로직은 이후 버전용으로 남긴다, 백엔드도 403 요구를 없앤다

## Tests Executed

- `redocly lint docs/api/openapi.yaml`

## Test Results

- 기존 1 error·6 warning 그대로, 새 문제 없음

## Known Problems

- WKS-BE 가 아직 프로필 등록에 코드 인증을 요구한다(403 DATING_NOT_VERIFIED) — 백엔드 반영 전 실제 서버 등록 불가

## Unverified Assumptions

- 없음

## Exact Next Action

없음
