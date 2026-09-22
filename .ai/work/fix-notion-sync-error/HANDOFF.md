# Handoff — fix-notion-sync-error

- From: claude-opus-5
- To: 없음
- Date: 2026-09-23
- Phase / Task: -/-

## Goal

⚔️ PRD 동기화가 41행 전부를 Notion 보드에 쓰고, 실패했을 때 원인이 CI 로그에 남는다.

## Work Completed

- `fail()` 을 stderr 로 보냈다 — `notion_upsert` 는 `$(...)` 안에서 돌아 stdout 으로 찍힌 Notion API 오류가 호출자 변수에 삼켜지고 있었다.
- `NOTION_PRD_DB` 를 보드 URL 의 data source id(…80c9…)에서 database id(3dffb10f-6501-8042-8dd9-c7a0d162aceb)로 바꿨다 — `Notion-Version: 2022-06-28` 의 `/v1/databases/{id}` 는 data source id 를 404 로 거절한다.
- ADR·Phase·Task 동기화를 뺐다. 옛 워크스페이스 DB 라 지금 통합이 닿지 못하고 매 실행 404 만 냈다 (소유자 확인 2026-09-23).
- push 트리거 경로를 `docs/prd/**` 로 좁히고 실행을 `--prd` 로 한정했다.

## Work In Progress

- 없음

## Files Changed

- `scripts/lib/common.sh`
- `.github/workflows/notion-index-sync.yml`

## Decisions Made

- ADR·Phase 색인은 복구하지 않는다 — 옛 노션이고 더 쓰지 않는다 (소유자 지시).

## Tests Executed

- `gh workflow run notion-index-sync.yml --ref ws/fix-notion-sync-error` (run 35769302145, 35770875546)

## Test Results

- `PRD: 41행`, 실패 0. 고치기 전에는 41행 전부 `[FAIL]` 이고 원인은 로그에 없었다.

## Known Problems

- 없음

## Unverified Assumptions

- 없음

## Exact Next Action

dev 에 병합한다.
