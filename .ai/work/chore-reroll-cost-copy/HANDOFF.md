# Handoff — chore-reroll-cost-copy

- From: claude-code
- To: 없음
- Date: 2026-09-29
- Phase / Task: 10/T3 (부분 — 비용 표기만)

## Goal

리롤 비용이 백엔드·Figma·화면에서 모두 20실로 같다.

## Work Completed

- 대조 확인: BE `REROLL_COST=20`(49d8c32) · Figma 112:3675 '실 20개로 지금 변경하기' · PRD FR-27 20
- 운영 코드는 고치지 않았다 — `RerollSheet` 은 서버가 준 `rerollCost` 를 그대로 그린다
- 미리보기 고정값이 3 이라 디자인 검토에서 '실 3개'로 보였다 — 20 으로 고쳐 잔액 고정값도 24 로
- PLAN 의 '실 5개' 2곳과 RerollSheet 주석('백엔드 반영 예정')을 현재 사실로

## Work In Progress

- 없음

## Files Changed

- commit b5b5c27 참조 (미리보기 고정값 · 주석 · PLAN)

## Decisions Made

- 운영 코드에 비용을 상수로 두지 않는다 — 서버가 판정하고 화면은 옮긴다(FR-27)
- 해금 비용(10·7·5·3)은 BE `DatingUnlockField` 와 이미 같아 건들지 않았다

## Tests Executed

- `npx vitest run --pool=forks` · `pnpm typecheck` · `pnpm lint`
- 브라우저: `/preview/dating-cards` 의 '리롤 무료 x' · '리롤 잔액 부족'

## Test Results

- 742 중 741 통과 — 실패한 `openingGate.test.ts` 는 이 변경 전에도 같이 실패하는 node v24 ICU 로케일 문제다
- 화면: '실 20개로 지금 변경하기' · 잔액 부족 안내 '운명의 실 20개가 필요해요'

## Known Problems

- `DatingCards.test.tsx` · `DatingCardsScreen.test.tsx` 의 고정값은 아직 3·5 다 — 문구를 단정하는 값이 아니고 Touches 밖이라 두었다
- PLAN T3 은 여전히 미완료다 — 이 스트림은 비용 표기만 고쳤다

## Unverified Assumptions

- 없음

## Exact Next Action

PR 을 dev 로 올린다.
