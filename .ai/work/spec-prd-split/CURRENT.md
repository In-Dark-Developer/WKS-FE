# Current State — spec-prd-split

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: spec-prd-split
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/spec-prd-split
- Task: -/-
- Issue: none
- Touches: docs/PRD.md,docs/prd/,scripts/,.github/workflows/notion-index-sync.yml,AGENTS.md,README.md,docs/decisions/,.ai/team/announcements/,docs/product-brief.md,docs/phases/_template/PLAN.md
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-design-tokens, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo

## Current Phase

— (Task 밖 스트림)

## Current Task

spec: prd-split

## Status

REVIEW

## Progress

- [x] 1. `docs/PRD.md` → `docs/prd/` 절별 5파일 + README 지도
- [x] 2. 경로를 읽는 도구 6곳 갱신 (common.sh · ai-start · ai-end ×2 · notion-index-sync.sh · workflow)
- [x] 3. 살아 있는 문서 참조 갱신 (AGENTS.md · README.md · product-brief · phases/_template)
- [x] 4. ADR-20260923-prd-split + 공지 작성, 공지 색인 갱신
- [x] 5. 검증 — FR/NFR grep 24행 · bash -n · typecheck · lint

## Last Checkpoint

`7d1f492`

## Relevant Documents

- `AGENTS.md`

## Relevant Source Files

- `docs/prd/30-functional-requirements.md` (FR-1~18)
- `scripts/lib/common.sh:SPEC_PATHS` · `scripts/notion-index-sync.sh:prd 절`

## Next Action

PR 리뷰. 병합 뒤 Notion 색인 동기화 워크플로가 실제로 24행을 올리는지 확인한다.
