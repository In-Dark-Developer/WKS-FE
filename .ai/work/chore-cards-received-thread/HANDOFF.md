# Handoff — chore-cards-received-thread

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-28
- Phase / Task: -/-

## Goal

상대가 먼저 실을 보낸 추천 카드는 보내기(409) 대신 받은 신청 탭으로 안내한다.

## Work Completed

- isThreadReceived 추가, 버튼 "상대가 보낸 운명의 실 확인하기" → /dating/requests?tab=received, 해금 숨김 (3bab5ce)

## Work In Progress

- 없음

## Files Changed

- src/features/dating/recommendation/{cardsView,recommendationsLoader,DatingCards,DatingCardsScreen}.ts(x) + 테스트
- src/app/preview/screens/dating-cards.tsx

## Decisions Made

- 받은 요청도 CANCELLED 외 상태면 막힌 것으로 본다(BE existsBetween 과 같음)
- 버튼 문구는 Figma 없이 정했다 — 디자인 확인 필요

## Tests Executed

- pnpm test · typecheck · lint, /preview/dating-cards 미리보기

## Test Results

- 전부 통과

## Known Problems

- 거절(REJECTED) 뒤에도 양쪽 다 다시 보낼 수 없다 — BE 정책 확인 요청 중

## Unverified Assumptions

- 없음

## Exact Next Action

<다음 세션(또는 다음 사람)이 첫 번째로 할 일 한 줄>
