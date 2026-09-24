# Handoff — chore-signup-resend-mail

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-24
- Phase / Task: -/-

## Goal

인증 메일 발송 실패(`mailSent: false`)나 이미 신청한 이메일(409)을 만난 사용자가 화면에서 바로 `POST /signups/resend`로 인증 메일을 다시 받을 수 있다.

## Work Completed

- `ResendMail` 컴포넌트: `resendSignupMail` 호출, 성공·재실패·이미 인증(400 INVALID_INPUT) 안내
- 완료 화면(`mailSent: false`)과 중복 신청(409) 안내 아래에 연결 (668ee69, 33fbf18)

## Work In Progress

- 없음

## Files Changed

- `src/features/profile/ResendMail.tsx`·`.test.tsx` (신규)
- `src/features/profile/PreRegisterForm.tsx`·`.test.tsx`, `PreRegisterComplete.tsx`

## Decisions Made

- 재발송은 `preRegisterAction` 에 `intent: 'resend'` 로 보낸다(`useFetcher`) — 공지 server-state-session
- 완료 카드는 실패 문구 없이 버튼만(main 핫픽스 #191·#192 와 같은 문구, 그 브랜치를 병합해 둠)
- analytics 이벤트는 추가하지 않았다(범위 밖, `src/lib/analytics.ts` 수정 필요)

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint`
- preview `/preview/pre-register?state=이미 신청함` 에서 버튼 노출 확인

## Test Results

- 88 files / 452 tests 통과, typecheck·lint 경고 없음

## Known Problems

- 메일 발송 실패의 근본 원인(운영 SMTP)은 백엔드 쪽 — FE 는 재시도 경로만 제공

## Unverified Assumptions

- 없음

## Exact Next Action

PR CI 확인 후 병합.
