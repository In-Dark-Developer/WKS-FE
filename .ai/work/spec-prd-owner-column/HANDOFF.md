# Handoff — spec-prd-owner-column

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-opus-5
- To: 없음
- Date: 2026-09-23
- Phase / Task: -/-

## Goal

`docs/prd/` 의 FR·NFR 표만 보고도 누가 맡은 요구사항인지 알 수 있다.

## Work Completed

- FR(31행)·NFR(10행) 표 맨 끝에 `담당` 열을 붙였다 — 맨 끝이라 `notion-index-sync.sh` 의 열 위치 파싱(FR 은 2~5번째 칸, NFR 은 2~4번째 칸)은 그대로다.
- 2026-09-23 배정 39건을 적었다: 이정진 13 · 이동건 13 · 강근우 11 · 곽도윤 2. FE 가 아닌 NFR-9·NFR-10 만 `—`.
- `## 선후 관계` 절을 더했다 — 보드의 `선행`·`후행` 관계와 같은 내용이고 보드가 원본이다.
- 두 표 머리에 원본이 Notion ⚔️ PRD 보드이고 이 열은 사본임을 적었다.

## Work In Progress

- 없음

## Files Changed

- `docs/prd/30-functional-requirements.md`
- `docs/prd/40-quality.md`

## Decisions Made

- 열을 맨 끝에 둔다 — 중간에 넣으면 동기화 스크립트의 `cut -d'|' -f` 위치가 밀려 구분·우선순위가 어긋난다.
- 보드를 원본으로 유지한다 (ADR-20260923-prd-single-notion-db). 동기화는 `담당` 을 읽지도 쓰지도 않으므로 배정이 바뀌면 보드를 먼저 고치고 이 표를 손으로 맞춘다.

## Tests Executed

- `bash scripts/notion-index-sync.sh --prd --dry-run`

## Test Results

- `PRD: 41행` — 열 추가 전과 같다. 구분·우선순위 값도 바뀌지 않았다.

## Known Problems

- 보드와 이 표가 손으로 맞춰야 하는 두 벌이 된다 — 배정이 자주 바뀌면 드리프트가 생긴다.

## Unverified Assumptions

- 없음

## Exact Next Action

dev 에 병합한다.
