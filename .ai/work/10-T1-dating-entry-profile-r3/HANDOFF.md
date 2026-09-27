# Handoff — 10-T1-dating-entry-profile-r3

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: @nicerjs23 (claude-code)
- To: @jjjung0921 (이정진 · Phase 10 Lead · 10/T5 퍼블리싱 소유자 — PR 리뷰)
- Date: 2026-09-27
- Phase / Task: 10/T1

## Goal

프로필 (2/2)의 학교 메일이 코드 인증(발송·입력·재발송·완료)을 마쳐야 등록되고, 백엔드 오류 다섯 가지가 화면 문구로 갈린다.

## Work Completed

- `src/api/emailCodes.ts`·`schema/emailCodes.ts` — `POST /dating/email-codes`·`/verify`. 목 모드는 코드 `123456`(미리보기와 같은 값), 재발송 60초·만료 10분을 흉내 낸다
- `entry/emailVerification.ts` — 오류 매핑(INVALID_EMAIL_DOMAIN·DATING_PROFILE_CONFLICT·EMAIL_CODE_RATE_LIMITED·INVALID_EMAIL_CODE·MAIL_UNAVAILABLE) + 재발송 시각 변환
- `DatingProfileScreen` — 10/T5 의 `emailVerification` prop 을 채운다. 상태 전환(idle→sending→sent→verifying→verified), 재발송하면 인증 상태를 되돌린다(백엔드가 이전 코드·인증을 무효로 한다)
- **인증을 마친 주소로만 등록한다** — 인증 뒤 메일을 고치면 저장을 막고 코드 오류를 보인다
- `schema/envelope.ts` 에 오류 코드 3종 추가 — 없으면 그 코드가 올 때 봉투 파싱이 스키마 오류로 떨어진다

## Work In Progress

- 없음 (PR 대기)

## Files Changed

- `src/api/{emailCodes,schema/emailCodes,schema/envelope}.ts` (+테스트)
- `src/features/dating/entry/{DatingProfileScreen,emailVerification}.tsx|ts` (+테스트)

## Decisions Made

- 인증 여부는 화면 상태로 들고, 등록 직전에 '인증한 주소 == 지금 입력한 주소'를 확인한다 — 메일을 고친 뒤 그대로 저장되는 것을 막는다
- 연결 실패·모르는 오류는 `mail-unavailable`(다시 시도)로 묶었다 — 사용자가 할 일이 같다
- 목 코드는 퍼블리싱 미리보기와 같은 `123456` 으로 맞췄다

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint`

## Test Results

- 109 files / 607 passed · typecheck·lint 경고 0

## Known Problems

- 실제 모드 확인은 아직이다 — 메일을 받을 수 있는 dgu 계정이 필요하다
- 재발송 24시간 10회 제한(429)은 `rate-limited` 문구로만 알린다 — 남은 횟수를 응답이 주지 않는다

## Unverified Assumptions

- 없음

## Exact Next Action

`scripts/ai-end.sh --ready` 로 PR. 실제 모드 확인이 끝나면 PLAN T1 을 체크한다.
