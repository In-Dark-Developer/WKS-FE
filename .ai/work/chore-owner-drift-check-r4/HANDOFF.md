# Handoff — chore-owner-drift-check-r4

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude
- To: 없음
- Date: 2026-09-23
- Phase / Task: -/-

## Goal

표기가 같은 이름은 대응표 없이도 대조된다.

## Work Completed

- `map_owners` — 대응표에 없으면 표시 이름을 그대로 쓴다. '모른다' 로 실패시키던 분기 제거
- `notion-owners.tsv` — 표기가 다른 둘만 남겼다: `정진 이`→`이정진`, `근우 강`→`강근우`

## Work In Progress

- 없음

## Files Changed

- `scripts/notion-index-sync.sh` · `scripts/lib/notion-owners.tsv`

## Decisions Made

- 표기가 같은 이름(`이동건`·`곽도윤`)까지 표에 적게 하면 팀원이 늘 때마다 표만 늘고 검사가 헛되이 빨개진다. 표는 다를 때만 쓴다
- 대응표에 없는 이름은 그대로 비교되므로, 정말 다르면 '보드 X ≠ 저장소 Y' 로 드러난다 — 놓치지 않는다

## Tests Executed

- `bash -n`
- `map_owners` 단독 실행 — 뒤집힌 이름 둘, 같은 이름 둘, 여러 명, 빈 값

## Test Results

- `정진 이`→`이정진`, `근우 강`→`강근우`, `이동건`·`곽도윤` 그대로, 여러 명은 쉼표로 이어짐

## Known Problems

- 저장소 `담당` 이 보드와 크게 다르다 — 보드는 FR-1~31·NFR-1~8 에 담당자가 있는데 저장소는 19행만 차 있다. PR #172 에서 맞춘다

## Unverified Assumptions

- 없음

## Exact Next Action

병합 후 PR #172 에서 저장소 `담당` 을 보드 값으로 맞춘다.
