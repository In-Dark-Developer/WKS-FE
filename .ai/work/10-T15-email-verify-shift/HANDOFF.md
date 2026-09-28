# Handoff — 10-T15-email-verify-shift

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-28
- Phase / Task: 10/T15

## Goal

학교 메일 코드를 보낸 뒤 화면(메일 칸)이 커졌다 작아지지 않는다.

## Work Completed

- 원인: 재발송 카운트다운 숫자가 비례 폭이라 매초 버튼 폭이 바뀌고 flex-1 메일 칸이 따라 변함
- `SendButton` 에 `tabular-nums`

## Work In Progress

- 없음

## Files Changed

- `src/features/dating/profile/EmailVerification.tsx:SendButton` · `src/features/dating/profile/EmailVerification.test.tsx`

## Decisions Made

- '인증' → '재발송 1:00' 한 번의 폭 변화는 글자가 바뀌는 것이라 두었다. QA 의 반복되는 흔들림만 고쳤다

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · 브라우저 미리보기 폭 측정

## Test Results

- 693 passed · 수정 전 새 테스트 실패 확인 · 375px 에서 8초 동안 버튼 114.4px·메일 칸 194.6px 고정

## Known Problems

- 없음

## Unverified Assumptions

- 없음

## Exact Next Action

PR 병합
