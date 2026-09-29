# Current State — chore-partner-entry-modal


- Stream: chore-partner-entry-modal
- Owner: gn00py48@gmail.com
- Branch: ws/chore-partner-entry-modal
- Task: -/-
- Issue: none
- Touches: src/features/auth/,src/features/dating/,src/app/routes/,src/app/RootLayout.tsx,docs/phases/10-dating-onboarding/PLAN.md
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-cloudflare-pages, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-form-owner-change, 2026-09-13-hosting-domains, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-workers-static-assets, 2026-09-14-aws-cloudfront-hosting, 2026-09-14-domain-threadoffate, 2026-09-14-netlify-personal-fork, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture, 2026-09-24-ci-sync-warn, 2026-09-24-dating-publishing-split, 2026-09-24-prd-completion-fields, 2026-09-25-cookie-auth-contract, 2026-09-27-dating-request-cancelled, _template

## Current Phase

10 (QA 후속 — T20)

## Current Task

chore: partner-entry-modal

## Status

REVIEW

## Progress

- Figma 522:2756 · 234:2797 대조 뒤 재화 모달 '친구에게 공유' 줄 갱신
- PartnerEntryDialog(SCR-23 1.1) 작성 · partnerRef 노출 조건 헬퍼 추가
- 메인 티저 loader·화면에 연결 · 지급 알림 모달을 RootLayout 으로
- test · typecheck · lint · 브라우저 확인
## Last Checkpoint

`c4623fd`

## Relevant Documents

- `AGENTS.md` · `docs/phases/10-dating-onboarding/PLAN.md` (T18, T20)

## Relevant Source Files

- `src/features/dating/reward/PartnerEntryDialog.tsx` · `PendingRewardDialog.tsx`
- `src/features/auth/partnerRef.ts:hasPartnerRef`
- `src/app/routes/saju.routes.tsx:mainTeaserLoader` · `src/app/RootLayout.tsx`
- `src/features/dating/wallet/ThreadGuideDialog.tsx:others`

## Next Action

PR 을 dev 로 올리고, 백엔드(MapFriendRewardService)의 '친구 로그인 시 +2' 규칙 반영을 담당자에게 넘긴다.
