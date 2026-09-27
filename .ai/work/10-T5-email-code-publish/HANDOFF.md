# Handoff — 10-T5-email-code-publish

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-27
- Phase / Task: 10/T5

## Goal

프로필 (2/2) 의 학교 메일 코드 인증 UI 가 props 뷰 모델로 그려지고, @dgu.ac.kr 이 아닌 메일은 제출이 막힌다.

## Work Completed

- 도메인 검사(대소문자 무관)와 오류 문구 `emailDomain`
- `EmailVerification`·`emailVerificationView` — 인증 버튼·6자리 코드·재발송 타이머·완료, DatingProfileForm `emailVerification` prop(10/T1 이 넘긴다)

## Work In Progress

- 없음

## Files Changed

- `src/features/dating/profile/` (options·profileSchema·DetailsStep·DatingProfileForm·EmailVerification*)
- `src/app/preview/screens/dating-profile.tsx` · `src/features/dating/index.ts`

## Decisions Made

- 2026-09-27 소유자: V1 에 이메일 코드 인증 포함(도메인만 확인 결정 철회, spec #248). 도메인 검사는 유지
- 재발송 타이머는 `resendAvailableAt` 을 key 로 다시 마운트 — 응답이 늦어도 60초부터 센다

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint`
- 브라우저 /preview/dating-profile — V1 도메인 오류, (이후 버전) 발송→오답→123456 인증 완료

## Test Results

- 593 passed, typecheck·lint 경고 없음. 브라우저 콘솔 오류 없음

## Known Problems

- 없음

## Unverified Assumptions

- 없음

## Exact Next Action

병합 후 10/T1 이 `emailVerification` 에 발송·확인 API 를 연결한다.
