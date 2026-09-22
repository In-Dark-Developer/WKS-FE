# Current State — spec-notion-prd-sync

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: spec-notion-prd-sync
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/spec-notion-prd-sync
- Task: -/-
- Issue: none
- Touches: scripts/notion-index-sync.sh,.github/workflows/notion-index-sync.yml,docs/prd/,docs/decisions/,.ai/team/announcements/
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-design-tokens, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-prd-split, 2026-09-23-dev-default-branch

## Current Phase

— (Task 밖 스트림)

## Current Task

spec: notion-prd-sync

## Status

REVIEW

## Progress

- [x] 1. 동기화 대상 DB 를 ⚔️ PRD 로 바꾸고 속성 매핑 교체
- [x] 2. Phase 에서 상태를 계산해 덮어쓰던 동작 제거 + 쓰이지 않게 된 헬퍼 3개 삭제
- [x] 3. FR 표에 `Area` 열 추가(31행) — 보드의 `구분` 이 된다
- [x] 4. ADR-20260923-prd-single-notion-db + Required 공지
- [x] 5. 검증 — `--prd --dry-run` 41행, 속성·우선순위 매핑 확인

## Last Checkpoint

`8471334`

## Relevant Documents

- `AGENTS.md`

## Relevant Source Files

- `scripts/notion-index-sync.sh:prd_props`, `:sync_prd`
- `docs/prd/30-functional-requirements.md` (Area 열)

## Next Action

PR 병합 후 CI 로그에서 "PRD: 41행" 을 확인하고, 보드의 옛 수기 행을 지운다.
