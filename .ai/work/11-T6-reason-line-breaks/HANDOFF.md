# Handoff — 11-T6-reason-line-breaks

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-28
- Phase / Task: 11/T6

## Goal

카드 뒷면과 요청함 상세의 궁합 까닭이 카드 폭 안에서 줄을 바꾸고, 백엔드 문장의 줄바꿈도 그대로 보인다.

## Work Completed

- 연 값 `dd` 에 `whitespace-pre-line` — 요청함 상세도 같은 CandidateBack 이라 함께 적용
- 긴 글 줄바꿈(`wrap-anywhere`)은 #275 에서 들어갔다
- PLAN 11/T4·T5(#275)·T6 [x]

## Work In Progress

- 없음

## Files Changed

- `src/features/dating/card/CandidateFaces.tsx`(+test) · `docs/phases/11-dating-thread/PLAN.md`

## Decisions Made

- Touches 에 `CandidateFaces.test.tsx` 를 더했다(테스트는 소스 옆)

## Tests Executed

- `pnpm test` · `typecheck` · `lint` · 목 모드 `/preview` 눈 확인

## Test Results

- 전부 통과, 경고 0

## Known Problems

- 없음

## Unverified Assumptions

- 없음

## Exact Next Action

PR 리뷰.
