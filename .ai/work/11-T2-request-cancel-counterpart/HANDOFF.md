# Handoff — 11-T2-request-cancel-counterpart

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-27
- Phase / Task: 11/T2

## Goal

요청함이 WKS-BE 4d2e534 계약(취소·counterpart)으로 동작한다 — 보낸 신청을 취소하면 목록에서 빠지고 카드에서 다시 보낼 수 있으며, 받은 신청은 상대 정보와 궁합 점수가 보인다.

## Work Completed

- zod `CANCELLED`·목록 `counterpart` 스키마, `cancelDatingRequest`(목 포함)
- 요청함 취소 버튼 연결(성공·실패 토스트 후 다시 읽기)
- 요청함 뷰를 counterpart 로 채움 — 받은 신청도 궁합 점수 표시
- 요청함·카드 '보냄' 판정에서 CANCELLED 제외(재요청 가능)

## Work In Progress

- 없음

## Files Changed

- `src/api/schema/matchRequests.ts` · `src/api/matchRequests.ts`
- `src/features/dating/requests/{requestsLoader,requestsView,DatingRequestsScreen}.ts(x)`
- `src/features/dating/recommendation/recommendationsLoader.ts` · 테스트 4개

## Decisions Made

- 받은 신청 궁합 점수 노출(소유자, Figma 109:2251) — PLAN OPEN-2 갱신
- 보낸 신청의 순위·까닭은 지금 카드에 있는 상대만 카드에서 가져온다(목록에 없음)

## Tests Executed

- pnpm test · typecheck · lint
- 목 모드 브라우저: 받은 신청 목록, 보내기 → 취소 → 목록에서 빠짐 → 카드에서 다시 보내기

## Test Results

- test 569 통과, typecheck·lint 통과, 브라우저 흐름 정상·콘솔 오류 없음

## Known Problems

- Figma 받은 신청 뒷면(109:2542)은 궁합 까닭을 보이지만 BE 목록에 reason 이 없다 — 잠금으로 둔다. 백엔드 담당에 문의 필요
- PRD Q17(`docs/prd/50-scope.md`)·FR-30 문구는 spec 스트림에서 정리해야 한다

## Unverified Assumptions

- 없음

## Exact Next Action

PR 리뷰·병합. 실제 모드(dev 서버)에서 취소 확인은 로그인 가능한 `*.threadoffate.site` 에서.
