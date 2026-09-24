# Current State — 08-T5-perf-budget

- Stream: 08-T5-perf-budget
- Owner: gn00py48@gmail.com
- Branch: ws/08-T5-perf-budget
- Task: 08/T5
- Issue: none
- Touches: scripts/check-bundle-size.mjs, .github/workflows/ci.yml, package.json, docs/phases/08-launch-readiness/
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract-r2, 2026-09-13-backend-contract, 2026-09-13-cloudflare-pages, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-form-owner-change, 2026-09-13-hosting-domains, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-workers-static-assets, 2026-09-14-aws-cloudfront-hosting, 2026-09-14-domain-threadoffate, 2026-09-14-netlify-personal-fork, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture, 2026-09-24-ci-sync-warn, 2026-09-24-dating-publishing-split, 2026-09-24-prd-completion-fields

## Current Phase

08-launch-readiness — `docs/phases/08-launch-readiness/PLAN.md`

## Current Task

T5. 성능 예산 측정

## Status

BLOCKED

## Progress

- check-bundle-size.mjs — 초기 JS gzip 합계, 250KB 초과면 exit 1 ✓
- package.json check:bundle · ci.yml bundle size 단계(+scope 에 스크립트) ✓
- Lighthouse 모바일(느린 4G) 운영 3회 → LCP 중앙값 4.77s ❌ · 초기 JS 161.4KB ✓
- RESULT 에 측정값·원인 기록 ✓
- LCP 줄이는 변경 — Touches 확장 승인 대기(BLOCKED) ←

## Last Checkpoint

`75dc54e`

## Relevant Documents

- `docs/phases/08-launch-readiness/PLAN.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `scripts/check-bundle-size.mjs` (신규)
- `.github/workflows/ci.yml` (commands job, test 뒤)
- `package.json` scripts

## Next Action

소유자가 줄이는 변경(인트로 포스터·Amplitude 지연 등)과 Touches 확장을 승인하면 CURRENT Touches 를 먼저 고치고 진행.
