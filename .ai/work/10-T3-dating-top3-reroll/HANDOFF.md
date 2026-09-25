# Handoff — 10-T3-dating-top3-reroll

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: @nicerjs23 (claude-code)
- To: @jjjung0921 (Phase 10 Lead · 퍼블리싱 10/T4 소유자 — PR 리뷰)
- Date: 2026-09-25
- Phase / Task: 10/T3

## Goal

`/dating/cards` 가 `GET /dating/recommendations` 로 오늘의 인연 Top 3 를 그리고, 잠긴 항목은 값 대신 비용을 보이며, '다른 인연 만나보기'가 무료·유료·잔액 부족을 가른다.

## Work Completed

- 없음

## Work In Progress

- CURRENT Progress 1~5.

## Files Changed

- 없음

## Decisions Made

- 없음

## Tests Executed

- 없음

## Test Results

- 없음

## Known Problems

- PLAN 의 `After: T1, T2, T4` 중 T2(재화 '실')가 아직 없다 — 잔액은 `GET /me` 의 `threadBalance` 를 그대로 보이고, 획득·소모 원장은 10/T2 가 맡는다
- 리롤 API 가 BE 에 없다(api-spec.md §10 '#84 구현 상태') — 무료 1회·실 3 차감은 목 전용이고 실제 모드에서는 버튼이 막힌다
- `GET /dating/recommendations` 는 학교 메일 인증 연동 전까지 `DATING_NOT_VERIFIED` 403
- 잠긴 사진 썸네일 API 가 없어 `thumbnailUrl` 은 항상 null
- 10/T1-r2(PR #210, 미병합)가 같은 `src/api/dating.ts` 를 고친다 — 병합 뒤 `git merge dev` 로 맞춘다

## Unverified Assumptions

- 없음

## Exact Next Action

CURRENT Progress 1 — openapi.yaml 에 `GET /dating/recommendations` 를 넣는다.
