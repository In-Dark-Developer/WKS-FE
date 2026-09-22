# Handoff — spec-notion-prd-sync

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-23
- Phase / Task: -/-

## Goal

요구사항 Notion 이 ⚔️ PRD 보드 하나이고, 저장소가 원문 열을, 사람이 추적 열을 갖는다.

## Work Completed

- `notion-index-sync.sh` PRD 절을 보드 스키마로 교체 — `이름`·`ID`·`구분`·`우선순위`(Must/Should/Could → P0/P1/P2)만 보낸다
- Phase 에서 계산한 `상태` 를 보내던 동작 제거(사람이 적은 값을 덮어썼다) + 그 사슬의 헬퍼 `phase_status`·`phases_of`·`status_of` 삭제
- 워크플로 `NOTION_PRD_DB` → `3dffb10f-…`(⚔️ PRD)
- FR 표 31행에 `Area` 열 추가, 누가 어느 열을 갖는지 문서화
- ADR-20260923-prd-single-notion-db + Required 공지 2026-09-23-prd-notion-db

## Work In Progress

- 없음

## Files Changed

- `scripts/notion-index-sync.sh` · `.github/workflows/notion-index-sync.yml`
- `docs/prd/30-functional-requirements.md` · `docs/decisions/ADR-20260923-prd-single-notion-db.md` · `.ai/team/`

## Decisions Made

- 저장소가 원문(ID·이름·구분·우선순위), Notion 이 추적(상태·담당자·FE·BE·수용 기준·비고). CI 는 추적 열을 쓰지 않는다.
- 🙋 요구사항 색인 DB 는 더 갱신하지 않는다. ADR·Phase 색인은 그대로 둔다.
- Notion 을 원천으로 뒤집는 안은 택하지 않았다 — Spec first(Rule 7)와 보호 브랜치 봇 커밋 비용 때문이다. 근거는 ADR Alternatives 3안.

## Tests Executed

- `NOTION_PRD_DB=x bash scripts/notion-index-sync.sh --prd --dry-run` · `bash -n` · YAML 파싱

## Test Results

- 41행(FR 31 + NFR 10), FR 은 Area→구분·Must→P0 매핑, NFR 은 구분=비기능·우선순위 없음

## Known Problems

- 보드에 2026-09-23 수기로 만든 47행이 남아 있다(ID 체계가 다르다). 병합 후 지워야 중복이 없다 — 담당자·상태가 모두 비어 있어 잃을 값은 없다.

## Unverified Assumptions

- 없음

## Exact Next Action

병합 후 CI 로그 확인 → 보드의 옛 47행 삭제 → 새 41행에 담당자·FE/BE 지정.
