# Handoff — spec-prd-table-fixes

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude
- To: 없음
- Date: 2026-09-23
- Phase / Task: -/-

## Goal

docs/prd 의 모든 표가 헤더·구분선·셀 수가 맞아 정상 렌더된다.

## Work Completed

- `20-screens.md` — SCR-14 와 SCR-15 사이 빈 줄 삭제. 빈 줄이 표를 둘로 쪼개 뒤쪽 8행(SCR-15~22)이 구분선 없는 블록이 되어 파이프가 본문에 그대로 찍혔다
- `40-quality.md` — Success Criteria 헤더·구분선은 4열인데 SC-1~SC-9 는 3열이라 `담당` 이 통째로 비어 있었다. 9행에 값 추가
- `40-quality.md` — `담당` 값의 출처 규칙을 Success Criteria 앞 문단에 명시

## Work In Progress

- 없음

## Files Changed

- `docs/prd/20-screens.md` (-1줄) · `docs/prd/40-quality.md`

## Decisions Made

- SC `담당` 은 새로 배정하지 않고 그 기준이 걸린 FR·NFR 의 담당을 따른다 — SC-6=NFR-3, SC-7=FR-21, SC-8=FR-26~28, SC-9=FR-30. V0.5 에서 충족한 SC-1~SC-5 는 `—`
- 원본은 Notion ⚔️ PRD 보드 `담당자` 이고 이 표는 사본이다 (NFR 표와 같은 규칙)

## Tests Executed

- `docs/prd/*.md` 6개 파일의 표 구조 검사 (헤더·구분선·행별 셀 수)

## Test Results

- 6개 파일 모두 통과. 20-screens 표는 24행 연속, 셀 수 전부 5

## Known Problems

- SC-8 은 해금(FR-28 강근우)과 추천(FR-26·27 이동건)에 걸쳐 담당이 두 명이다 — 보드에서 한 명으로 좁힐지는 소유자 판단

## Unverified Assumptions

- 없음

## Exact Next Action

PR 리뷰 후 병합하고 Phase 09/T1 로 돌아간다.
