# Handoff — chore-notion-owner-people

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-13
- Phase / Task: -/-

## Goal

Notion Task 보드의 Owner 가 Person 속성이고, notion-sync.sh 가 GitHub 핸들을 Notion 사용자 id 로 옮겨 써서 동기화가 깨지지 않는다.

## Work Completed

- 보드 스키마 Owner text→Person, 28행 Owner 채움 (Notion MCP 로 직접)
- `owner_uid` 표(3명)와 people 페이로드, 표에 없는 핸들은 warn 후 생략
- ADR-20260912-notion-task-board-sync 의 Owner 문장·Consequences 갱신

## Work In Progress

- 없음

## Files Changed

- scripts/notion-sync.sh · docs/decisions/ADR-20260912-notion-task-board-sync.md

## Decisions Made

- 핸들→id 표를 스크립트 안에 둔다 (Notion 사용자 id 는 비밀값이 아니고, 팀 3명이라 별도 파일이 과하다)

## Tests Executed

- `bash -n scripts/notion-sync.sh` · `props_json` 을 소싱해 people 페이로드 jq 출력 확인 · `ai-end.sh --ready`

## Test Results

- 통과 (실제 Notion API 호출은 CI 의 notion-sync 잡에서 처음 검증된다)

## Known Problems

- 이 PR 병합 전에 도는 notion-sync 잡은 Owner 에 rich_text 를 보내 400 으로 실패한다 (보드 스키마는 이미 Person)

## Unverified Assumptions

- 없음

## Exact Next Action

PR 병합 후 notion-sync 잡 로그와 보드 Owner 를 확인한다.
