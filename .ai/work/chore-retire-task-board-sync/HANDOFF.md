# Handoff — chore-retire-task-board-sync

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-opus-5
- To: 없음
- Date: 2026-09-23
- Phase / Task: -/-

## Goal

스트림 PR 의 검사 목록에 상시 빨간 `sync` 가 없다.

## Work Completed

- `notion-sync.yml` 과 `scripts/notion-sync.sh` 를 지웠다 — 옛 워크스페이스의 ✅ Task 보드(`10aa90e7-…`)를 부르느라 `ws/**` push·PR 마다 404 로 실패했다.
- ADR-20260912-notion-task-board-sync 를 Superseded 로 바꾸고 ADR-20260923-retire-task-board-sync 를 썼다.
- `scripts/lib/notion.sh` 는 남겼다 — `notion-index-sync.sh` 가 쓴다.

## Work In Progress

- 없음

## Files Changed

- `.github/workflows/notion-sync.yml` (삭제)
- `scripts/notion-sync.sh` (삭제)
- `docs/decisions/ADR-20260912-notion-task-board-sync.md`
- `docs/decisions/ADR-20260923-retire-task-board-sync.md` (신규)

## Decisions Made

- 보드를 새 워크스페이스로 옮기지 않는다 — 스트림 현황은 `ai-stream.sh status` 와 GitHub 이 이미 갖고 있고 ⚔️ PRD 보드와 역할이 겹친다.
- 워크플로를 두고 실패를 무시하지 않는다 — 상시 빨간 검사가 진짜 실패를 가린다.

## Tests Executed

- `gh run view 35771920401 --log-failed` 로 실패 원인 확인

## Test Results

- `HTTP 404: Could not find database with ID: 10aa90e7-…` — 통합이 옛 DB 에 접근할 수 없다. 워크플로가 사라지면 이 검사 자체가 보고되지 않는다.

## Known Problems

- ✅ Task 보드는 2026-09-23 이후 갱신되지 않는다 — 옛 기록으로만 남는다.

## Unverified Assumptions

- 없음

## Exact Next Action

dev 에 병합한다.
