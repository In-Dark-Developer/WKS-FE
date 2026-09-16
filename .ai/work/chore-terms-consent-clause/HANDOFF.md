# Handoff — chore-terms-consent-clause

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-17
- Phase / Task: -/-

## Goal

사주 입력의 약관 시트 맨 끝에 [동의] 절이 보인다.

## Work Completed

- `TermsSheet` 에 `withConsentClause` — [동의] 절을 맨 끝에 붙인다
- 사주 입력(`SajuForm`)만 켬, 사전신청은 체크박스 명시 동의라 끔
- PRD FR-17 갱신

## Work In Progress

- 없음

## Files Changed

- `src/ui/TermsSheet.tsx`·`.test.tsx` · `src/features/saju/SajuForm.tsx`·`.test.tsx` · `src/features/profile/PreRegisterForm.test.tsx` · `docs/PRD.md`

## Decisions Made

- [동의] 절은 '점지 확인' 버튼을 가리켜 사주 입력에만 둔다 — 사전신청은 FR-17 대로 체크박스 동의

## Tests Executed

- pnpm test·lint·typecheck (exit code)

## Test Results

- 모두 exit 0 · test 366(신규 3)

## Known Problems

- 공유 링크 입력(SCR-06)은 같은 SajuForm 이지만 버튼이 '운명 지도 확인하기'라 문구의 '점지 확인'과 다르다 — 문구는 소유자 전달 그대로 두었다

## Unverified Assumptions

- 없음

## Exact Next Action

PR merge 후 fork 로 배포.
