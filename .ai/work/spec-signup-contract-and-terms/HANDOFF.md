# Handoff — spec-signup-contract-and-terms

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-16
- Phase / Task: -/-

## Goal

Phase 06 구현이 따라갈 계약·요구사항이 실제 백엔드와 새 디자인에 맞는다.

## Work Completed

- `docs/api/openapi.yaml` — `/signups` 배포 확인·404 응답 추가·`resultId` 필수 해제, `resend` 응답 스키마 확정, `verify` 리다이렉트 목적지 `/verify`
- `docs/PRD.md` — FR-9(결과 화면 사전신청 섹션 873:4155) · FR-10(연락처 둘 다 필수 + 성별·선호 성별) · FR-17(이용약관 시트 + 명시 동의 유지) · SCR-02·04·09 출처 갱신 · SCR-14 `/verify` 신설 · Q14 갱신
- `docs/phases/06-dating-gate/PLAN.md` — 차단 항목 해제, T3 범위 조정, T4 신설, AC7·AC8 추가
- ADR-20260916-signup-contract-gap

## Work In Progress

- 없음

## Files Changed

- `docs/api/openapi.yaml` · `docs/PRD.md` · `docs/phases/06-dating-gate/PLAN.md` · `docs/decisions/ADR-20260916-signup-contract-gap.md`

## Decisions Made

- 계약이 받지 않는 7칸은 화면에서 받되 전송하지 않는다 (소유자 결정, ADR)
- 성별·선호 성별은 사전신청 폼에 세그먼트 두 줄로 받는다 — 계약 필수값인데 디자인에 없다
- 동의는 체크박스 명시 동의 유지, 이용약관 시트는 사주 입력·사전신청 양쪽

## Tests Executed

- 없음 (문서만 바뀌었다)

## Test Results

- 없음

## Known Problems

- 백엔드 `CreateSignupRequest` 확장이 축제(2026-09-29) 전에 닫히지 않으면 신청자가 적은 7칸이 저장되지 않는다 — 백엔드 소유자에게 요청 필요

## Unverified Assumptions

- 운영 `app.signup.allowed-email-domains` 값이 비어 있는지 설정돼 있는지 모른다 — 비어 있으면 아무 이메일이나 통과한다
- `verify-redirect-url` 운영값이 `https://threadoffate.site/verify` 로 설정돼 있다고 가정한다(기본값은 localhost)

## Exact Next Action

PR merge 후 06/T3·T4 구현 스트림을 열어 `src/api/signups.ts` 부터 만든다.
