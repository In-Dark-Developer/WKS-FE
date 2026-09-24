# Handoff — chore-dating-rank-label

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-24
- Phase / Task: -/-

## Goal

오늘의 인연 카드의 관계 유형 문구가 순위로 고정된다 — 1위 천생연분 · 2위 찰떡궁합 · 3위 귀한인연.

## Work Completed

- `relationLabelByRank` 추가, `MatchCandidateView.relationLabel` 삭제·`rank` 를 1|2|3 으로 좁힘 (b90cde1)

## Work In Progress

- 없음

## Files Changed

- `src/features/dating/recommendation/{cardsView.ts,CandidateCard.tsx,CandidateCard.test.tsx,DatingCards.test.tsx}` · `src/app/preview/screens/dating-cards.tsx`

## Decisions Made

- 백엔드 추천 응답(WKS-BE api-spec §10.4)에 tier 가 없어 문구를 화면 규칙으로 둔다(소유자 지시 2026-09-24). 요청함(requestsView)의 relationLabel 은 Phase 11 범위라 그대로 뒀다

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint`

## Test Results

- 87 파일 446 테스트 통과, 타입·린트 경고 없음

## Known Problems

- 없음

## Unverified Assumptions

- 없음

## Exact Next Action

PR 리뷰·병합. 10/T3 연동 시 응답 rank 를 CandidateRank 로 파싱한다.
