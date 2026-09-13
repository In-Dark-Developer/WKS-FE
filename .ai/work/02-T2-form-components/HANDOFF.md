# Handoff — 02-T2-form-components

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-13
- Phase / Task: 02/T2

## Goal

Button·IconButton·TextField·Checkbox·SegmentedControl·Field 가 Figma 디자인시스템대로 라벨·에러·비활성 상태를 지원하고 테스트가 통과한다.

## Work Completed

- Button — primary·accent·secondary·ghost, L56·M48, loading(스피너·'처리 중', 누를 수 없음), 아이콘 슬롯 (commit 0dbf26a)
- IconButton — ghost·surface, 44px, label 필수(aria-label)
- Field — 라벨·도움말·에러·성공, render prop 으로 id·aria-describedby·aria-invalid·disabled 전달
- TextField — 6상태, `onClear` 있으면 값 있을 때 지우기 버튼
- Checkbox(native input + peer 스타일, invalid) · SegmentedControl(radiogroup, 두 옵션, value null 허용)
- Icon — SVG 를 CSS 마스크로 그려 글자색을 따름. check·spinner SVG 추가

## Work In Progress

- 없음

## Files Changed

- `src/ui/{Button,IconButton,Field,TextField,Checkbox,SegmentedControl,Icon}.tsx` + 각 `.test.tsx`
- `src/ui/assets/icons/check.svg`, `spinner.svg`
- `docs/phases/02-design-system/PLAN.md` (T2 체크)

## Decisions Made

- 기준은 디자인시스템 컴포넌트(16-2). 화면 목업(수정본)과 다른 점은 Known Problems
- `Icon.tsx` 추가(Touches 확장) — 세 컴포넌트와 02/T6 Select 가 같은 아이콘 처리를 쓴다
- 56px·44px 은 Space 토큰이 없어 `h-[56px]`·`size-[44px]`·`min-h-[44px]` 값으로 둠(주석)
- 로딩 버튼은 disabled 로 막되 비활성 스타일은 적용 안 함(Figma State=Loading)
- Field 는 cloneElement 대신 render prop — Select·TextArea 도 같은 방식으로 받는다

## Tests Executed

- `pnpm test`·`typecheck`·`lint`·`build`
- 브라우저: 버튼 높이 56/48 실측, 아이콘 마스크, Tab·방향키로 SegmentedControl 선택·포커스 링

## Test Results

- 78 tests 통과, 나머지 통과

## Known Problems

- 수정본 화면은 디자인시스템과 다르다 — 입력 배경 Neutral/50·테두리 Border/Default, 선택 세그먼트 Action/Teal, 주 버튼 Apricot. 03/T4 에서 어느 쪽을 따를지 디자이너 확인 필요
- `@testing-library/user-event` 없음 — jsdom fireEvent 는 disabled input 도 토글해서 비활성 테스트는 속성만 확인
- Space 토큰에 44·56 없음 — Figma 에 추가하거나 값 허용을 CONVENTIONS 에 적어야 함

## Unverified Assumptions

- 없음

## Exact Next Action

PR 리뷰 후 병합, 02/T6 시작
