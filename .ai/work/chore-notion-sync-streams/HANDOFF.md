# Handoff — chore-notion-sync-streams

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-12
- Phase / Task: -/-

## Goal

스트림을 열면 종류에 상관없이 Notion 보드에 나타난다 — Task 스트림은 사람이 만든 행을, 그 밖의 스트림은 동기화가 만든 행을 쓴다.

## Work Completed

- 보드에 `Stream`(text) 속성 추가 — 스트림 id로 행을 찾는 열
- `notion-sync.sh` 재구성: Task 스트림은 Phase+Task 행 갱신(전과 동일), 그 밖의 스트림은 `Stream` 열로 찾고 없으면 생성(제목·Touches 포함)
- ADR-20260912-notion-board-rows-for-streams, 공지 `2026-09-12-board-rows-for-streams`

## Work In Progress

- 없음

## Files Changed

- `scripts/notion-sync.sh`(재구성) · `docs/decisions/ADR-20260912-notion-board-rows-for-streams.md` · `.ai/team/announcements/2026-09-12-board-rows-for-streams.md` · `.ai/team/README.md`(색인)

## Decisions Made

- 이전 ADR의 "행은 사람이 만든다"를 **Task 행에 한정**으로 좁혔다. Task 행 목록의 주인은 여전히 Phase 계획이다
- 자동 생성 행은 `Phase`·`Task`를 비운다 — spec·chore는 Phase에 속하지 않는다
- 이전 ADR은 Superseded로 바꾸지 않았다. 뒤집은 게 아니라 한 조항을 좁힌 것이라 둘 다 유효하다

## Tests Executed

- `bash -n`, 이 스트림의 push 자체가 실케이스 (Actions `notion-sync`)

## Test Results

- `[ok] chore-notion-sync-streams → 행 생성 · 상태 '진행중' · Owner @jjjung0921`. 보드에서 제목·Stream·Touches까지 채워진 것을 확인했다

## Known Problems

- PR #2·#3 병합 시점에는 head 브랜치에 워크플로가 없어 '완료' 전이가 실행되지 않았다 — 보드의 01/T1 행이 아직 리뷰다. 다음 병합부터는 잡힌다
- 이미 병합돼 더 push되지 않는 스트림(chore-notion-sync)은 행이 생기지 않는다. 필요하면 `--stream` 옵션으로 한 번 돌린다

## Unverified Assumptions

- 보드 행이 늘어나도(스트림마다 한 행) 팀이 보기 불편해지지 않는다 — Phase 뷰로 거르면 된다고 가정했다

## Exact Next Action

PR을 올려 병합한다. 병합 이벤트에서 이 행이 완료로 바뀌는지 확인하면 '완료' 전이까지 실검증된다.
