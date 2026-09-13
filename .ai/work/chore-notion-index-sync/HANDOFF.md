# Handoff — chore-notion-index-sync

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-13
- Phase / Task: -/-

## Goal

docs/PRD.md 와 docs/decisions/ 가 main 에 병합되면 Notion 요구사항 색인·ADR 색인이 사람 손 없이 같은 내용이 된다.

## Work Completed

- `scripts/lib/notion.sh` 추출(notion_api·notion_find·notion_upsert), `notion-sync.sh` 는 `api()` 래퍼로 공유
- `scripts/notion-index-sync.sh` — FR/NFR 24행·ADR 9행 upsert, Phase 는 PLAN 언급, 상태는 Phase Status, `--dry-run`
- 워크플로 `notion-index-sync.yml` · ADR-20260913 · 공지 · Notion 「운꿰사」 머리말 문장 갱신
- 📅 Phase 색인 DB 를 Notion 에 만들고(`6585b534…`) `--phases` 로 `docs/phases/README.md` 표를 upsert (8행)

## Work In Progress

- 없음

## Files Changed

- `scripts/notion-index-sync.sh` · `scripts/lib/notion.sh` · `scripts/notion-sync.sh` · `.github/workflows/notion-index-sync.yml` · `docs/decisions/ADR-20260913-notion-index-sync.md` · `.ai/team/announcements/2026-09-13-notion-index-sync.md` · `.ai/team/README.md`

## Decisions Made

- 단방향(저장소 → Notion), ID 로 upsert, 삭제 미동기화, ADR `영역` 열만 사람 소유 (ADR-20260913)
- Phase 구분자 `·` 는 출력 직전에만 붙인다 — sed/tr 이 멀티바이트를 로케일에 따라 깨뜨려 NFR-4 가 '완료'로 잘못 나왔던 버그

## Tests Executed

- `bash -n` 3개 · `notion-index-sync.sh --dry-run`(토큰 없이) · `notion-sync.sh --help`

## Test Results

- FR 18 + NFR 6 + ADR 9 + Phase 8 행 속성 JSON 정상. FR-1 은 Phase 빈 값(PLAN 언급 없음, MVP 제외) 정상. 실제 Notion 호출은 로컬에 토큰이 없어 미실행

## Known Problems

- 실 호출 미검증 — 병합 후 `workflow_dispatch` 로 첫 실행. NOTION_TOKEN 통합이 요구사항 색인·ADR 색인 DB 에 연결돼 있어야 한다(보드만 연결돼 있으면 404)
- `notion-sync.sh` 리팩터(api → lib)는 `--check` 를 로컬에서 못 돌렸다 — 다음 ws push 의 sync 잡이 검증한다

## Unverified Assumptions

- 색인 DB 의 database id = Notion URL 의 id (c46fef81… · 96bba6ec…), 데이터소스 id 가 아니라 database id 로 query 가 된다(보드와 같은 방식)

## Exact Next Action

PR 병합 → Actions `notion-index-sync` Run workflow → Notion 두 색인 확인.