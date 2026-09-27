# Handoff — spec-prd-reroll-cost-20

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: @nicerjs23 (claude-code)
- To: @jjjung0921 (이정진 · PR 리뷰) · 곽도윤(백엔드 — `REROLL_COST` 5 → 20)
- Date: 2026-09-28
- Phase / Task: -/-

## Goal

리롤 비용이 문서·목·디자인에서 모두 20 으로 같고, 화면은 서버가 준 값을 그대로 쓴다.

## Work Completed

- `docs/prd/30-functional-requirements.md` FR-27 — 실 5개 → **실 20개**(2026-09-28 확정). 판정 주체가 서버라는 문장은 유지
- `docs/api/openapi.yaml` — 리롤 경로 설명('회당 20실')·`rerollCost` 설명·402 설명(숫자 대신 '비용보다 적다')
- `src/api/dating.ts` — 목 리롤 비용 `REROLL_PAID_COST` 5 → 20, 주석
- `recommendationsLoader.ts` — 주석에서 옛 값(PRD '실 3') 언급 제거

## Work In Progress

- 없음 (PR 대기)

## Files Changed

- `docs/prd/30-functional-requirements.md` · `docs/api/openapi.yaml` · `src/api/dating.ts`(+테스트) · `src/features/dating/recommendation/recommendationsLoader.ts`

## Decisions Made

- 화면·뷰 모델에는 숫자를 두지 않는다 — 비용은 추천 응답의 `rerollCost` 뿐이다. 이 PR 이 바꾸는 5→20 은 문서와 **목** 값이다
- 목 유료 리롤은 이제 늘 402 다 — 목 계정이 받는 실(가입 10 · 출석 5)이 비용 20 보다 적다. 테스트를 그 규칙으로 바로잡았다

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint` · `npx @redocly/cli lint docs/api/openapi.yaml`

## Test Results

- 114 files / 651 passed · typecheck·lint 경고 0 · redocly 기존 7건 그대로(새 문제 없음)

## Known Problems

- **백엔드는 아직 `REROLL_COST = 5`** 다(2026-09-28 dev 확인). 바뀔 때까지 실제 모드에서는 5 가 보인다 — 화면은 서버 값을 쓰므로 코드 수정은 필요 없다
- **목 모드에서 유료 리롤을 눌러 볼 수 없다** — 목 잔액 최대 15(가입 10 + 출석 5) < 20. 수동 QA 로 유료 리롤을 보려면 실제 모드가 필요하다
- 어제 올린 #250 이 같은 줄을 3 → 5 로 고쳤다. 근거를 백엔드 구현으로 잡은 것이 잘못이었고, 이 PR 이 팀 결정(20)으로 맞춘다

## Unverified Assumptions

- 없음

## Exact Next Action

PR 을 올리고, 백엔드에 `REROLL_COST` 20 반영을 확인한다.
