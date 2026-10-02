# Handoff — chore-site-close

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-10-03
- Phase / Task: -/-

## Goal

운영 배포에서 2026-10-04 02:00 KST 이후 어떤 주소로 들어와도 종료 안내가 보이고, 피드백은 Amplitude 로 가고, 커피 모달은 계좌번호를 복사한다.

## Work Completed

- 없음

## Work In Progress

- 구현·preview 완료. 커피 계좌번호(`SiteClosed.tsx:COFFEE_ACCOUNT`)를 소유자에게 받으면 바꾸고 dev PR → release PR(10/4 02:00 전)

## Files Changed

- 없음

## Decisions Made

- 소유자(2026-10-03): 시각 게이트(예약 병합 아님) · 사이트 전체 · 피드백은 Amplitude `feedback_submitted` · 피드백 화면은 뒤로가기로 안내 복귀
- 소유자(2026-10-03): 빈 입력이면 버튼 비활성(디자인은 노란 버튼) · 커피 모달은 정중앙(디자인은 37px 아래) — 지금대로 둔다

## Tests Executed

- 없음

## Test Results

- 없음

## Known Problems

- 없음

## Unverified Assumptions

- 없음

## Exact Next Action

<다음 세션(또는 다음 사람)이 첫 번째로 할 일 한 줄>
