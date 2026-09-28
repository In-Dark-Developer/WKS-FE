# Handoff — 11-T1-unlock

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-26
- Phase / Task: 11/T1

## Goal

Top 3 카드에서 사진·이름·학과·궁합 까닭을 실로 항목별 해금할 수 있고(10·7·5·3), 같은 항목은 한 번만 차감되며, 해금 전 값은 화면·응답에 없다 (FR-28).

## Work Completed

- openapi: `POST /dating/candidates/{candidateId}/unlock` · `DatingUnlockField`·`DatingUnlockResult` · `DatingLockableField` 확정(cost·value null) · `INSUFFICIENT_THREAD` 402
- api: envelope 에 `INSUFFICIENT_THREAD`·`METHOD_NOT_ALLOWED`(BE 에 있는데 빠져 있어 봉투 파싱이 깨질 수 있었다) · lockable 스키마 value nullable · `unlocks.ts`(목: 목 추천·목 잔액을 바꾼다)
- features: `unlock/unlockFlow.ts`(모달 칸·순서대로 해금·402 에서 멈춤) · `DatingCardsScreen` 에 해금 모달·완료 모달·실패 안내

## Work In Progress

- 없음

## Files Changed

- `docs/api/openapi.yaml` · `src/api/{unlocks,dating,me}.ts` · `src/api/schema/{dating,envelope}.ts`
- `src/features/dating/unlock/unlockFlow.ts` · `recommendation/{DatingCardsScreen,recommendationsLoader}.ts(x)` + 테스트

## Decisions Made

- Touches 확장(소유자 자동 진행 지시 2026-09-26): 해금 API·스키마·에러 코드가 `src/api/` 에 있어야 한다 — `unlocks.ts` 는 ARCHITECTURE 가 정한 파일

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · redocly lint(전·후 같음)

## Test Results

- 102 files / 541 tests 통과, 오류·경고 0

## Known Problems

- 백엔드 해금은 한 번에 한 항목이라 모달의 여러 항목은 순서대로 부른다 — 중간에 실패하면 앞서 연 것은 열린 채다(안내 문구로 알림)
- 열렸는데 값이 null(궁합 까닭 생성 실패)인 항목은 비용 0 잠금으로 보여 다시 열게 했다 — 카드에 '0' 자물쇠가 보인다
- 운명의 실을 보낸 뒤 미해금 항목 해금 금지(FR-29)는 11/T2 몫
- 실기기·브라우저 눈 확인 안 함 — 목 모드 테스트로만 확인

## Unverified Assumptions

- 없음

## Exact Next Action

PR 병합 뒤 11/T2 스트림 open
