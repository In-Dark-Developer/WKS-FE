# Current State — 08-T5-perf-budget

- Stream: 08-T5-perf-budget
- Owner: gn00py48@gmail.com
- Branch: ws/08-T5-perf-budget
- Task: 08/T5
- Issue: none
- Touches: scripts/check-bundle-size.mjs, .github/workflows/ci.yml, package.json, docs/phases/08-launch-readiness/, src/features/intro/IntroVideo.tsx, src/features/intro/IntroVideo.test.tsx, public/intro-poster.webp, src/lib/analytics.ts, src/lib/analytics.test.ts, index.html
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract-r2, 2026-09-13-backend-contract, 2026-09-13-cloudflare-pages, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-form-owner-change, 2026-09-13-hosting-domains, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-workers-static-assets, 2026-09-14-aws-cloudfront-hosting, 2026-09-14-domain-threadoffate, 2026-09-14-netlify-personal-fork, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture, 2026-09-24-ci-sync-warn, 2026-09-24-dating-publishing-split, 2026-09-24-prd-completion-fields

## Current Phase

08-launch-readiness — `docs/phases/08-launch-readiness/PLAN.md`

## Current Task

T5. 성능 예산 측정

## Status

REVIEW

## Progress

- check-bundle-size.mjs — 초기 JS gzip 합계, 250KB 초과면 exit 1 ✓
- package.json check:bundle · ci.yml bundle size 단계(+scope 에 스크립트) ✓
- Lighthouse 모바일(느린 4G) 운영 3회 → LCP 중앙값 4.77s ❌ · 초기 JS 161.4KB ✓
- RESULT 에 측정값·원인 기록 ✓
- B안(소유자 승인): 포스터+preload · gtag/Amplitude load 뒤 ✓ — devtools LCP 5.03→2.52s
- PLAN T5 [x]·SHA → `--ready` ←

## Last Checkpoint

`f5738c8`

## Relevant Documents

- `docs/phases/08-launch-readiness/PLAN.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `scripts/check-bundle-size.mjs` (신규)
- `.github/workflows/ci.yml` (commands job, test 뒤)
- `package.json` scripts

## Next Action

작업 커밋 SHA 를 PLAN T5 에 적고 `--ready`. 배포 뒤 운영 Lighthouse 3회를 RESULT 에 덧붙인다.
