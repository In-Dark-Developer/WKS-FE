# Handoff — 09-T11-card-save-icon

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-27
- Phase / Task: 09/T11

## Goal

홈 운명 카드의 저장이 카드 앞면 오른쪽 아래 아이콘(Figma 58:2523)이다.

## Work Completed

- 카드 아래 '카드 저장하기' 버튼 제거, ConnectionCard frontAction 으로 앞면 아이콘(44px 터치, 아이콘 24 · text-brand)

## Work In Progress

- 없음

## Files Changed

- `src/features/share/card/{ConnectionCard,ResultCard}.tsx` · `ConnectionCard.css` + 테스트 · `src/app/routes/index.test.tsx`

## Decisions Made

- 아이콘은 앞면과 함께 뒤집혀 뒷면에서는 누를 수 없다(저장 이미지는 앞면 DestinyCard 만)

## Tests Executed

- test 625 · typecheck · lint · 브라우저 미리보기(아이콘 가운데 오른쪽 33·아래 31 = Figma)

## Test Results

- 전부 통과, 경고 없음

## Known Problems

- 없음

## Unverified Assumptions

- 없음

## Exact Next Action

없음
