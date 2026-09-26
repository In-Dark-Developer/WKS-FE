# Handoff — 09-T1-home-tab-teaser

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-26
- Phase / Task: 09/T1

## Goal

사주 결과가 있으면 결과 카드가, 없으면 메인 티저가 홈이다.

## Work Completed

- `IntroGate` `keepPassedOnLeave` — false 면 떠날 때 티저 지남 기록을 지운다
- `saju.routes` 가 `hasSaju`(readSession) 를 넘긴다 → 결과 없이 `/` 에 오면 홈 탭·뒤로가기 모두 티저
- PRD FR-19(홈 탭 분기)·FR-1(같은 접속 예외) 갱신

## Work In Progress

- 없음

## Files Changed

- `src/features/intro/{IntroGate.tsx,introSeen.ts,IntroGate.test.tsx}` · `src/app/routes/{saju.routes.tsx,index.test.tsx}` · `src/app/screens/BottomNavBar.tsx`(주석) · `docs/prd/30-functional-requirements.md`

## Decisions Made

- 소유자 확정(2026-09-26): 사주 없으면 티저가 홈. 뒤로가기도 같게(추천안). 사주가 있는 사용자는 기존대로 같은 접속 안에서 티저를 다시 보지 않는다

## Tests Executed

- `pnpm test`·`typecheck`·`lint` · 로컬 브라우저(목): 티저 → 새로운 인연 → 홈 탭 = 티저, 뒤로가기 = 티저, '내 사주 보기' = 폼

## Test Results

- 통과

## Known Problems

- 없음

## Unverified Assumptions

- 없음

## Exact Next Action

없음.
