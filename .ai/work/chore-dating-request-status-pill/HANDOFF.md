# Handoff — chore-dating-request-status-pill

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-28
- Phase / Task: -/-

## Goal

QA '받은 요청함에서 수락중… 궁합점수가 뜸' — 요청함 목록 줄 오른쪽에 궁합 점수 대신 요청 상태 알약을 보인다(Figma 390-2842).

## Work Completed

- 보낸·받은 목록 줄 모두 상태 알약: 기다림 '신청중' · 성립 '수락됨' · 실패/거절 '거절됨'(Figma 390:2842 그라데이션 3종)
- 궁합 점수 알약(`data-score-pill`) 제거

## Work In Progress

- 없음

## Files Changed

- `src/features/dating/requests/RequestInbox.tsx` · `RequestInbox.test.tsx` · `src/features/dating/dating.css`

## Decisions Made

- 받은 신청의 응답 전 상태도 '신청중'(Figma 는 보낸 목록만 그렸다)

## Tests Executed

- `pnpm test` · `typecheck` · `lint` · 목 모드 `/preview` 눈 확인

## Test Results

- 전부 통과, 경고 0

## Known Problems

- 없음

## Unverified Assumptions

- 없음

## Exact Next Action

PR 병합 확인
