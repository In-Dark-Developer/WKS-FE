# Current State — chore-photo-upload-errors


- Stream: chore-photo-upload-errors
- Owner: gn00py48@gmail.com
- Branch: ws/chore-photo-upload-errors
- Task: -/-
- Issue: none
- Touches: src/api/uploads.ts,src/api/schema/dating.ts,src/features/dating/profile/,src/features/dating/entry/,src/app/preview/screens/dating-profile.tsx,docs/phases/10-dating-onboarding/PLAN.md
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-cloudflare-pages, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-form-owner-change, 2026-09-13-hosting-domains, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-workers-static-assets, 2026-09-14-aws-cloudfront-hosting, 2026-09-14-domain-threadoffate, 2026-09-14-netlify-personal-fork, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture, 2026-09-24-ci-sync-warn, 2026-09-24-dating-publishing-split, 2026-09-24-prd-completion-fields, 2026-09-25-cookie-auth-contract, 2026-09-27-dating-request-cancelled, _template

## Current Phase

— (Task 밖 스트림)

## Current Task

chore: photo-upload-errors

## Status

REVIEW

## Progress

- BE 한도(10MB · 2천만 화소) · Figma 134:3639 대조
- uploads.ts 가 실패 이유를 돌려준다 · 화소 사전 검사
- photoView · profileSubmitError 에 원인별 문구 · 화면 연결
- 미리보기에 실패 상태 10개 추가
- test · typecheck · lint · 브라우저 확인

## Last Checkpoint

`de79e24`

## Relevant Documents

- `AGENTS.md`

## Relevant Source Files

- `src/api/uploads.ts:uploadDatingPhoto` · `PhotoUploadFailure`
- `src/features/dating/profile/photoView.ts:photoErrorMessage`
- `src/features/dating/entry/profileSubmitError.ts:toProfileSubmitError`
- `src/features/dating/profile/DetailsStep.tsx` · `src/app/preview/screens/dating-profile.tsx`

## Next Action

PR 을 dev 로 올린다.
