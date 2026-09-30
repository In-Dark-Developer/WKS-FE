# Current State — chore-partner-claim-alert


- Stream: chore-partner-claim-alert
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/chore-partner-claim-alert
- Task: -/-
- Issue: none
- Touches: src/app/RootLayout.tsx,src/app/RootLayout.test.tsx,src/features/auth/partnerRef.ts,src/features/auth/partnerRef.test.ts,docs/phases/10-dating-onboarding/PLAN.md
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-cloudflare-pages, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-form-owner-change, 2026-09-13-hosting-domains, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-workers-static-assets, 2026-09-14-aws-cloudfront-hosting, 2026-09-14-domain-threadoffate, 2026-09-14-netlify-personal-fork, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture, 2026-09-24-ci-sync-warn, 2026-09-24-dating-publishing-split, 2026-09-24-prd-completion-fields, 2026-09-25-cookie-auth-contract, 2026-09-27-dating-request-cancelled, 2026-09-29-release-pr-ci, _template

## Current Phase

10 (QA 후속 — T22)

## Current Task

chore: partner-claim-alert

## Status

REVIEW

## Progress

- dev 사이트에서 `?ref=FESTIVAL` 재현 · 원인 확인(지급 알림이 응답보다 먼저 마운트)
- claim 지급 여부 반환 · RootLayout 이 알림을 다시 그림 · 500 이면 ref 유지
- test · typecheck · lint

## Last Checkpoint

`1901ab9`

## Relevant Documents

- `AGENTS.md` · `docs/phases/10-dating-onboarding/PLAN.md` (T20, T22)

## Relevant Source Files

- `src/app/RootLayout.tsx:RootLayout` · `src/features/auth/partnerRef.ts:claimPendingPartnerRef`
- `src/features/dating/reward/PendingRewardDialog.tsx` · `src/features/dating/wallet/ThreadGuideDialog.tsx`

## Next Action

PR 을 dev 로 올린다. 백엔드가 `GET /wallet` 에 제휴 지급 여부를 내주면 `ThreadGuideDialog` 축제 줄에 잇는다.
