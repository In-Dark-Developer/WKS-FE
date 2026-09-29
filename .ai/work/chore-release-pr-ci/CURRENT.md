# Current State — chore-release-pr-ci


- Stream: chore-release-pr-ci
- Owner: gn00py48@gmail.com
- Branch: ws/chore-release-pr-ci
- Task: -/-
- Issue: none
- Touches: scripts/ai-end.sh,scripts/lib/common.sh,.github/workflows/ci.yml,docs/decisions/,.ai/team/announcements/
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-cloudflare-pages, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-form-owner-change, 2026-09-13-hosting-domains, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-workers-static-assets, 2026-09-14-aws-cloudfront-hosting, 2026-09-14-domain-threadoffate, 2026-09-14-netlify-personal-fork, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture, 2026-09-24-ci-sync-warn, 2026-09-24-dating-publishing-split, 2026-09-24-prd-completion-fields, 2026-09-25-cookie-auth-contract, 2026-09-27-dating-request-cancelled, 2026-09-29-release-pr-ci, _template

## Current Phase

— (Task 밖 스트림)

## Current Task

chore: release-pr-ci

## Status

REVIEW

## Progress

- #329 실패 원인 확인 — head 가 dev 라 ws/* 규칙에 걸린다
- `is_release_pr` 추가 · `--ci` 에 면제 경로
- ci.yml 이 GITHUB_BASE_REF 를 넘기도록
- 경우 7가지를 detached HEAD 로 검증
- ADR · 공지 작성

## Last Checkpoint

`1b11e37`

## Relevant Documents

- `AGENTS.md`

## Relevant Source Files

- `scripts/lib/common.sh:is_release_pr` · `PROD_BRANCH`
- `scripts/ai-end.sh` (base/head 판정 · 면제 경로)
- `.github/workflows/ci.yml` (ai-check → GITHUB_BASE_REF)

## Next Action

PR 을 dev 로 올린다.
