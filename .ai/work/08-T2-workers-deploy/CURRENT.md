# Current State — 08-T2-workers-deploy

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 08-T2-workers-deploy
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/08-T2-workers-deploy
- Task: 08/T2
- Issue: none
- Touches: wrangler.jsonc, package.json, pnpm-lock.yaml, pnpm-workspace.yaml, .gitignore, public/_headers, docs/decisions/, docs/ARCHITECTURE.md, docs/api/openapi.yaml, docs/phases/08-launch-readiness/, docs/phases/README.md, .ai/team/announcements/, .ai/team/README.md
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-cloudflare-pages, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-form-owner-change, 2026-09-13-hosting-domains, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-workers-static-assets

## Current Phase

08-launch-readiness — `docs/phases/08-launch-readiness/PLAN.md`

## Current Task

T2. Cloudflare Pages 배포 설정

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 1. 오류 재현(pnpm add wrangler → ERR_PNPM_IGNORED_BUILDS)
- 2. allowBuilds·wrangler·wrangler.jsonc, dry-run
- 3. ADR·ARCHITECTURE·PLAN·공지

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`bd4dee6`

## Relevant Documents

- `docs/phases/08-launch-readiness/PLAN.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- (아직 없음)

## Next Action

PR 병합 → Workers Builds 재배포 확인(Worker 이름 wks-fe·빌드 변수) → 08/T3
