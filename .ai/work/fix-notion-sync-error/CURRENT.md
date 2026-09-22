# Current State — fix-notion-sync-error

- Stream: fix-notion-sync-error
- Owner: jjjung0921
- Branch: ws/fix-notion-sync-error
- Task: -/-
- Issue: none
- Touches: .github/workflows/notion-index-sync.yml, scripts/lib/common.sh
- Supersedes: none
- Acked: none

## Current Phase

없음 — Notion 동기화 장애 수습 (chore)

## Current Task

⚔️ PRD 동기화가 모든 행에서 실패하던 원인 두 가지를 고친다.

## Status

REVIEW

## Progress

- 실패 원인 추적 — `fail()` 이 stdout 으로 가 명령 치환에 삼켜지던 것을 stderr 로 돌림
- 드러난 404 확인 — 워크플로가 database id 가 아니라 data source id 를 쓰고 있었다
- `NOTION_PRD_DB` 를 database id 로 교체하고, 통합이 닿지 못하는 ADR·Phase·Task 동기화를 뺌
- dispatch 로 검증 — `PRD: 41행`, 실패 0

## Last Checkpoint

`(없음)`

## Relevant Documents

- docs/decisions/ADR-20260923-prd-single-notion-db.md

## Relevant Source Files

- `scripts/lib/common.sh:fail`
- `.github/workflows/notion-index-sync.yml`

## Next Action

리뷰 후 dev 에 병합한다.
