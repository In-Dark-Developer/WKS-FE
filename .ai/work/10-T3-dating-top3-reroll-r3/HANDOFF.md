# Handoff — 10-T3-dating-top3-reroll-r3

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: @nicerjs23 (claude-code)
- To: @jjjung0921 (이정진 · Phase 10 Lead — PR 리뷰)
- Date: 2026-09-27
- Phase / Task: 10/T3

## Goal

'다른 인연 만나보기'가 백엔드 리롤 API(§10.4.1)를 불러 카드 셋을 바꾸고, 무료·유료(5실) 판정이 서버 값(`rerollCost`)에서 오며, 연타·잔액 부족·후보 소진이 모두 막힌다.

## Work Completed

- 없음

## Work In Progress

- CURRENT Progress 1~5. 2026-09-27 백엔드가 리롤을 확정·구현했다(TBD-6 종료).

## Files Changed

- 없음

## Decisions Made

- 없음

## Tests Executed

- 없음

## Test Results

- 없음

## Known Problems

- **지금 코드에 실제 오류가 있다**: 리롤 비용을 3 으로 두었는데 확정값은 **5** 이고, 무료 여부를 '항상 무료'로 가정했다. 서버 `rerollCost` 로 바꾼다
- **연타를 서버가 막지 않는다**(§10.4.1) — 두 번 누르면 두 번 차감된다. 프론트가 막아야 한다
- 학교 이메일 인증이 매직링크에서 **코드 6자리 방식**으로 바뀌었다(§10.7, 2026-09-26) — FR-25 프로필 폼에 붙는 일이라 이 스트림 밖이다. 디자인 확인 뒤 별도 Task 가 필요하다

## Unverified Assumptions

- 없음

## Exact Next Action

CURRENT Progress 1 — openapi.yaml 에 `POST /dating/recommendations/reroll` 과 `rerollCost` 를 넣는다.
