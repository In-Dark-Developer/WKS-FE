# Handoff — 02-T6-select-textarea-photo

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-13
- Phase / Task: 02/T6

## Goal

Select·TextArea·PhotoUpload 가 Figma 디자인시스템대로 라벨·에러·비활성 상태를 지원하고 테스트가 통과한다.

## Work Completed

- Select — combobox 트리거 + 아래로 펼치는 listbox, ↑↓·Home·End·Enter·Space·Esc·Tab, 선택 체크, `name` 이면 hidden input, disabled·readOnly 는 안 펼침 (commit 9094369)
- TextArea — 6상태, `maxLength` 면 `n / max` 카운터(제어·비제어 모두)
- PhotoUpload — empty·uploading·uploaded·error·disabled, 숨긴 file input 을 Secondary 버튼이 연다, 검증은 화면 몫

## Work In Progress

- 없음

## Files Changed

- `src/ui/{Select,TextArea,PhotoUpload}.tsx` + 각 `.test.tsx`
- `docs/phases/02-design-system/PLAN.md` (T6 체크)

## Decisions Made

- 소유자 선택: T6 먼저 병합 후 03/T4
- Select 는 PickerSheet(바텀시트) 대신 수정본 화면처럼 트리거 아래 목록 — 6행까지 보이고 스크롤(`max-h-[288px]`, 토큰 없음)
- 스타일은 디자인시스템 기준. 수정본 톤(Neutral50·Teal)은 03/T4 에서 TextField·SegmentedControl 과 함께 맞춘다

## Tests Executed

- `pnpm test`·`typecheck`·`lint`·`build`
- 브라우저: 키보드로 열고 인시 선택, 목록이 아래 콘텐츠 위에 뜸

## Test Results

- 90 tests 통과, 나머지 통과

## Known Problems

- 수정본 12시진 목록은 자시 한 칸, 백엔드는 자시 두 칸(00:45·23:45) 요구 — PRD Q15, 03/T4 에서 결정 필요
- 목록이 화면 아래쪽이면 잘릴 수 있다(위로 뒤집기 없음) — 입력 폼 배치에선 문제 없음

## Unverified Assumptions

- 없음

## Exact Next Action

PR 병합 후 03/T4
