# Current State — spec-dev-integration-branch

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: spec-dev-integration-branch
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/spec-dev-integration-branch
- Task: -/-
- Issue: none
- Touches: scripts/,.github/workflows/,AGENTS.md,README.md,netlify.toml,docs/decisions/,.ai/team/announcements/
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-design-tokens, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo

## Current Phase

— (Task 밖 스트림)

## Current Task

spec: dev-integration-branch

## Status

REVIEW

## Progress

- [x] 1. `common.sh` — `main_ref()` → `INTEG_BRANCH`(기본 dev) + `integ_ref()`
- [x] 2. 호출부 3개 스크립트와 main 문구 교체
- [x] 3. 워크플로 트리거 (ci: dev·main push / notion-index-sync: dev)
- [x] 4. AGENTS.md(Rule 4·5·7·9·15·절차·History) · README · netlify.toml 주석
- [x] 5. ADR-20260923-dev-as-default-branch + Required 공지
- [x] 6. 검증 — bash -n · yaml 파싱 · `ai-stream.sh status` 가 origin/dev 기준으로 뜬다

## Last Checkpoint

`682c354`

## Relevant Documents

- `AGENTS.md`

## Relevant Source Files

- `scripts/lib/common.sh:INTEG_BRANCH`, `:integ_ref`
- `.github/workflows/{ci,notion-index-sync}.yml` 트리거

## Next Action

소유자가 GitHub 설정 2건(main 룰셋 생성 → 기본 브랜치 dev)을 적용한 뒤 이 PR 을 병합한다.
