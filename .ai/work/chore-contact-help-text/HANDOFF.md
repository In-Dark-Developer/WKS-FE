# Handoff — chore-contact-help-text

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-17
- Phase / Task: -/-

## Goal

사전신청 연락처 안내가 전화번호·인스타그램 모두 "매칭이 성립한 상대에게만 보여요."다.

## Work Completed

- 연락처 Field help 를 수단 분기 없이 한 문구로

## Work In Progress

- 없음

## Files Changed

- `src/features/profile/PreRegisterForm.tsx` · `PreRegisterForm.test.tsx`

## Decisions Made

- 없음

## Tests Executed

- pnpm test·lint·typecheck (exit code)

## Test Results

- 모두 exit 0 · test 358

## Known Problems

- GitHub Actions 결제 실패로 CI job 이 시작되지 않는다 — 이 PR 은 CI 확인 전 merge 하지 않았다

## Unverified Assumptions

- 없음

## Exact Next Action

결제 복구 후 PR CI 를 다시 돌리고 통과하면 merge.
