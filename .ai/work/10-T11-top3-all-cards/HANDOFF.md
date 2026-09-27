# Handoff — 10-T11-top3-all-cards

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: @nicerjs23 (claude-code)
- To: @jjjung0921 (이정진 · Phase 10 Lead · `recommendation/` 퍼블리싱 소유자 — PR 리뷰)
- Date: 2026-09-28
- Phase / Task: 10/T11

## Goal

'Top 3' 카드가 추천 인원과 무관하게 늘 세 자리로 보이고 인디케이터 점 세 개가 각각 그 자리를 가리킨다.

## Work Completed

- **재현**: 후보 3명이면 카드 3장·점 3개로 정상이고, **2명이면 2장·점 2개**였다. 캐러셀(스크롤·스냅·인디케이터) 자체는 문제가 없고 **자리 수가 후보 수를 그대로 따른 것**이 원인이다
- **고침**: `toCardSlots` 가 카드 자리를 늘 3개로 만들고 남는 자리에 빈 카드(인연x, Figma 134:2248)를 넣는다. 인디케이터도 그 자리를 가리킨다
- 후보 0명은 기존 동작을 지켰다 — 넘기기 없이 빈 카드 하나(FR-26)
- 빈 자리가 활성일 때 '운명의 실 보내기'는 기존 `disabled={!active}` 로 이미 막힌다

## Work In Progress

- 없음 (PR 대기)

## Files Changed

- `src/features/dating/recommendation/DatingCards.tsx` (+`DatingCards.test.tsx` 3·2·1·0명 네 갈래)

## Decisions Made

- 빈 카드로 채우는 방식은 #274 PR 본문의 2026-09-28 결정을 따랐다 — 'Top 3' 라는 이름과 QA 항목('탑3 카드가 다 떠야함')에 맞는다
- 자리 채우기를 화면(`DatingCards`)에서 한다 — 뷰 모델(`candidates`)에 가짜 후보를 넣으면 잔액·해금·전송 판정이 그 가짜를 상대로 돌 수 있다

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint`

## Test Results

- 113 files / 646 passed · typecheck·lint 경고 0

## Known Problems

- **PRD FR-26 은 아직 "1–2명일 때의 표시는 미정이다(Q21)"** 이고 Q21 도 `50-scope.md` 에 열려 있다. #274 본문은 이 규칙으로 PRD 를 고쳤다고 적었지만 실제 diff 에 `docs/prd/` 가 없다 — spec PR 로 따로 올린다(inconsistency 보고)
- 실기기에서 세 장이 다 넘겨지는지는 확인하지 않았다 — 자동 테스트는 자리 수·인디케이터만 본다

## Unverified Assumptions

- 없음

## Exact Next Action

FR-26·Q21 을 고치는 spec 스트림을 열어 PR 을 올린다.
