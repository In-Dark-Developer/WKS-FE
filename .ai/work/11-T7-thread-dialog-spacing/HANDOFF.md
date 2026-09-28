# Handoff — 11-T7-thread-dialog-spacing

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-28
- Phase / Task: 11/T7

## Goal

'운명의 실 보내기' 확인 모달과 보낸 뒤 모달의 위쪽 여백이 Figma 운명의 실 모달 1·2 와 같다.

## Work Completed

- Figma MCP 로 모달 1(`112:3993` 안 `Frame 206` 112:4032)과 모달 2(`112:3810` 안 `Frame 206` 112:3864)의 치수를 읽었다
- 실행 중인 앱(`/preview/dating-thread`)에서 같은 값을 실측해 대조했다
- 차이가 없어 코드를 고치지 않았다

## Work In Progress

- 없음

## Files Changed

- `docs/phases/11-dating-thread/PLAN.md` (T7 줄) 외 없음 — 코드 변경 0

## Decisions Made

- 수정하지 않는다. Figma 와 코드가 모든 값에서 같다:
  패널 폭 343 · 상단 32 · 하단 32 · 좌우 16 · 코끼리(124) ↔ 본문 24 · 제목 ↔ 설명 12 · 본문 ↔ 버튼 20.
  두 모달의 `Frame 209` 가 모두 `x=16, y=32` 라 위아래 여백이 32 로 같고, `DatingDialog` 의 `px-16 py-32 gap-24` 가 그대로다.
- 눈으로도 맞춰 봤다 — 실측이 Figma 수치와 1px도 다르지 않아 별도 조정을 넣으면 오히려 어긋난다.

## Tests Executed

- Figma `get_metadata`(112:3993 · 112:3810) · `/preview/dating-thread` 에서 `getComputedStyle` 실측
- `pnpm test` · `pnpm typecheck` · `pnpm lint` · `pnpm build`

## Test Results

- 실측 = { panelW 343, padTop 32, padBottom 32, padLeft 16, gap 24, imgSize 124 } — Figma 와 동일
- 검증 4종 통과 (코드 변경이 없어 기존 결과 그대로)

## Known Problems

- QA 가 무엇을 보고 '상단 간격' 을 적었는지는 알 수 없다. 지금 화면·지금 Figma 기준으로는 차이가 없다 — 다시 보이면 기기·화면 스크린샷을 받아 재개한다.

## Unverified Assumptions

- 없음

## Exact Next Action

PR 을 올린다.
