# Handoff — spec-prd-split

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-23
- Phase / Task: -/-

## Goal

요구사항 문서를 절별 파일로 나누고, 그 경로를 읽는 도구와 살아 있는 참조를 같은 PR 에서 함께 옮긴다.

## Work Completed

- `docs/PRD.md`(28KB) → `docs/prd/` 6파일 — README(지도)·10-product·20-screens·30-functional-requirements·40-quality·50-scope
- 도구 6곳: `lib/common.sh:SPEC_PATHS`, `ai-start.sh` spec 판정, `ai-end.sh` spec diff 2곳, `notion-index-sync.sh` FR grep, workflow paths
- 참조 4곳: `AGENTS.md`(Repository Map·Rule 2 ⑦), `README.md`, `docs/product-brief.md`, `docs/phases/_template/PLAN.md`
- ADR-20260923-prd-split + 공지 2026-09-23-prd-split (Required)

## Work In Progress

- 없음

## Files Changed

- `docs/prd/*` (신규 6) · `docs/PRD.md`(삭제) · `docs/decisions/ADR-20260923-prd-split.md`
- `scripts/{lib/common.sh,ai-start.sh,ai-end.sh,notion-index-sync.sh}` · `.github/workflows/notion-index-sync.yml`
- `AGENTS.md` · `README.md` · `docs/product-brief.md` · `docs/phases/_template/PLAN.md` · `.ai/team/`

## Decisions Made

- 절별로 나눴다(도메인별 아님) — FR 이 18개뿐이라 도메인 분할은 파일마다 두세 줄이 된다. V1 요구사항이 저장소로 들어오면 그때 `30-functional-requirements.md` 를 도메인별로 다시 쪼갠다 (ADR Alternatives 2안).
- FR·NFR 표는 한 파일에 유지 — 색인 동기화가 `| FR-… |` 줄을 그대로 읽는다.
- 과거 ADR·공지·완료된 Phase PLAN 의 `docs/PRD.md` 언급은 고치지 않았다(그 시점 기록). 대응 규칙은 공지가 준다.

## Tests Executed

- `grep -hE '^\| N?FR-[0-9]+ ' docs/prd/*.md | wc -l`
- `bash -n` (고친 스크립트 4개) · `pnpm typecheck` · `pnpm lint`

## Test Results

- FR·NFR 24행 — 분할 전과 같다 (FR 18 + NFR 6)
- 스크립트 문법 통과, 프론트 typecheck·lint 통과(코드 변경 없음)

## Known Problems

- 진행 중 Phase(06·07·08) PLAN 의 `docs/PRD.md` 링크가 죽는다 — Touches 밖이라 고치지 않았고, 각 Phase Lead 가 PLAN 을 고칠 때 함께 바꾸면 된다.
- Notion 색인 동기화는 main 병합 뒤 워크플로가 도는 것으로만 확인할 수 있다(로컬에서 토큰 없이 실행 불가).

## Unverified Assumptions

- 없음

## Exact Next Action

병합 후 notion-index-sync 워크플로 로그에서 "PRD: 24행" 을 확인한다.
