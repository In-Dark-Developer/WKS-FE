# Handoff — 11-T9-received-reason-notice

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-28
- Phase / Task: 11/T9

## Goal

받은 신청 상대 카드의 궁합 까닭이 블러 없이 보이거나, 백엔드가 까닭을 주지 않으면 블러 대신 없음 안내가 보인다.

## Work Completed

- 요청 목록(WKS-BE §11.1)에 까닭이 없어, 지금 Top 3 에 없는 상대의 까닭은 `null` 로 두고 뒷면에 '궁합 이유는 오늘의 인연 카드에서만 볼 수 있어요.'를 보인다(흐림 없음)
- Top 3 에 있는 상대(보낸 신청)는 그 카드의 까닭을 그대로 쓴다

## Work In Progress

- 없음

## Files Changed

- `src/features/dating/requests/{requestsView,requestsLoader}.ts`(+test) · `src/features/dating/card/CandidateFaces.tsx`(+test)

## Decisions Made

- Touches 에 `card/CandidateFaces.tsx`(+test) 를 더했다 — 뒷면 그리기가 거기 있다

## Tests Executed

- `pnpm test` · `typecheck` · `lint` · 목 모드 `/preview` 눈 확인

## Test Results

- 전부 통과, 경고 0

## Known Problems

- 받은 신청에서 까닭을 보이려면 WKS-BE 가 목록 `counterpart` 에 까닭을 넣어야 한다(요청 필요)

## Unverified Assumptions

- 없음

## Exact Next Action

PR 리뷰. 백엔드가 받은 목록에 까닭을 주면 null 대신 그 값을 쓴다.
