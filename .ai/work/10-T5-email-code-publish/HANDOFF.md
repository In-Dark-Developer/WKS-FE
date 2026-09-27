# Handoff — 10-T5-email-code-publish

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-27
- Phase / Task: 10/T5

## Goal

V1 프로필 (2/2) 은 @dgu.ac.kr 메일만 받고, 코드 인증 UI 는 이후 버전용으로 연결 없이 남아 있다.

## Work Completed

- 도메인 검사(대소문자 무관)와 오류 문구 `emailDomain`
- `EmailVerification`·`emailVerificationView` — 인증 버튼·6자리 코드·재발송 타이머·완료, V1 미연결

## Work In Progress

- 없음

## Files Changed

- `src/features/dating/profile/` (options·profileSchema·DetailsStep·DatingProfileForm·EmailVerification*)
- `src/app/preview/screens/dating-profile.tsx` · `src/features/dating/index.ts`

## Decisions Made

- 2026-09-27 소유자: V1 은 도메인만, 코드 인증 로직은 이후 버전 재사용용으로 남김
- 재발송 타이머는 `resendAvailableAt` 을 key 로 다시 마운트 — 응답이 늦어도 60초부터 센다

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint`
- 브라우저 /preview/dating-profile — V1 도메인 오류, (이후 버전) 발송→오답→123456 인증 완료

## Test Results

- 593 passed, typecheck·lint 경고 없음. 브라우저 콘솔 오류 없음

## Known Problems

- WKS-BE 가 아직 프로필 등록에 코드 인증을 요구한다(403) — 백엔드 반영 전 실제 서버 등록 불가

## Unverified Assumptions

- 없음

## Exact Next Action

없음 — 병합 후 10/T1 은 emailVerification 을 넘기지 않는다.
