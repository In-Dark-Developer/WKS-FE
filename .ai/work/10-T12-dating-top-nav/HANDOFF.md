# Handoff — 10-T12-dating-top-nav

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: @nicerjs23 (claude-code)
- To: @jjjung0921 (이정진 · Phase 10 Lead — PR 리뷰)
- Date: 2026-09-28
- Phase / Task: 10/T12

## Goal

Top 3 상단의 '운명의 실'·'요청함' 아이콘과 글자가 Figma `top_nav`(`91:1790`)와 같은 간격·크기로 보인다.

## Work Completed

- Figma `91:1790` 을 직접 읽어 값을 확인했다 — 바깥 여백 px 24 · pt 8 · pb 4, 칸 높이 **56**, 그림 **47×32**('운명의 실')·**41×38**('요청함'), 글자는 12/18 Medium 이고 칸 아래에 붙는다(`justify-between`)
- 그래서 간격이 각각 **6px · 0px** 다. 우리 코드는 둘 다 0 이었다 — 두 버튼을 `h-[56px] flex-col justify-between` 으로 바꿨다
- 헤더 정렬을 `items-end` → `items-center` 로 맞췄다(Figma 와 같다)
- `DatingHeader.test.tsx` 를 새로 만들었다 — 이 컴포넌트에 테스트가 없었다

## Work In Progress

- 없음 (PR 대기)

## Files Changed

- `src/features/dating/recommendation/DatingHeader.tsx` · `DatingHeader.test.tsx`(새로)

## Decisions Made

- 간격을 숫자(gap-6)로 박지 않고 Figma 처럼 **칸 높이 + justify-between** 으로 뒀다 — 그림 높이가 달라도 아래 줄이 맞는다
- 그림 크기·여백은 이미 Figma 와 같아 건드리지 않았다

## Tests Executed

- `pnpm test` · `pnpm typecheck` · `pnpm lint`

## Test Results

- 116 files / 662 passed(dev 병합 뒤) · typecheck·lint 경고 0

## Known Problems

- Figma 가 두 글자에 취소선(`line-through`)을 남겨 뒀다 — 시안 화면에는 그렇게 보이지 않아 옮기지 않았다. 의도된 것이면 알려 주세요
- 눈으로 본 확인은 하지 않았다 — 테스트가 높이·정렬 클래스를 단언한다

## Unverified Assumptions

- 없음

## Exact Next Action

PR 을 올리고 10/T7(프로필 (2/2) MBTI 칸 색)로 넘어간다.
