# Handoff — 09-T16-home-fortune-order

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: @nicerjs23 (claude-code)
- To: @jjjung0921 (이정진 · Phase 09 Lead — PR 리뷰)
- Date: 2026-09-28
- Phase / Task: 09/T16

## Goal

홈(SCR-04)의 운세 순서가 화면이 정한 순서(연애 → 결혼 → 자녀)를 따르고, 등급 스탬프 줄과 운세 카드가 같은 순서로 보인다.

## Work Completed

- **찾은 것**: 운세 카드 섹션(`FortuneSection`)은 이미 연애·결혼·자녀였고, **카드 위 등급 스탬프 줄**(`ReadingResult` 의 `face.grades`)만 백엔드 응답 순서(결혼·자녀·연애)를 따르고 있었다. 한 화면에서 두 순서가 엇갈렸다
- `fortuneOrder` 를 연애 → 결혼 → 자녀로 바꾸고, `FortuneSection` 이 갖고 있던 별 순서 상수(`sectionOrder`)를 없애 **한 상수가 순서를 정한다**
- 순서를 지키는 테스트를 새로 추가했다(`FortuneSection.test.tsx` — 이 파일이 없었다)

## Work In Progress

- 없음 (PR 대기)

## Files Changed

- `src/features/saju/readingView.ts` · `sections/FortuneSection.tsx` · `sections/FortuneSection.test.tsx`(새로) · `ReadingResult.test.tsx`(스탬프 순서 기대값)

## Decisions Made

- 순서의 근거는 소유자 확인(2026-09-28)이다 — Figma `8:794` 가 연애 → 결혼 → 자녀이고 PRD FR-3 의 "연애운·결혼운·자녀운" 과 같다. Figma 를 이 세션에서 직접 열 수 없어 소유자에게 물어 확인했다
- 상수를 하나로 합쳤다 — 두 곳에 순서가 있으면 이번처럼 한쪽만 고쳐 엇갈린다

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint`

## Test Results

- 114 files / 649 passed · typecheck·lint 경고 0

## Known Problems

- 실기기·브라우저로 눈으로 본 확인은 하지 않았다 — 자동 테스트가 제목 순서를 단언한다
- 카드 스탬프 줄은 `renderCard` 로 넘기는 값이라 `DestinyCard`(`src/ui/`) 안의 배치는 이 PR 이 건드리지 않았다

## Unverified Assumptions

- 없음

## Exact Next Action

PR 을 올리고 10/T13(리롤 시트 실 문구)으로 넘어간다.
