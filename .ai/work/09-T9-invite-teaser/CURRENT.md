# Current State — 09-T9-invite-teaser

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 09-T9-invite-teaser
- Owner: gn00py48@gmail.com
- Branch: ws/09-T9-invite-teaser
- Task: 09/T9
- Issue: none
- Touches: src/features/friends/, src/features/saju/, src/app/screens/ShareInputScreen.tsx, src/app/routes/share.routes.tsx, src/app/routes/index.test.tsx
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract-r2, 2026-09-13-backend-contract, 2026-09-13-cloudflare-pages, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-form-owner-change, 2026-09-13-hosting-domains, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-workers-static-assets, 2026-09-14-aws-cloudfront-hosting, 2026-09-14-domain-threadoffate, 2026-09-14-netlify-personal-fork, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture, 2026-09-24-ci-sync-warn, 2026-09-24-dating-publishing-split, 2026-09-24-prd-completion-fields, 2026-09-25-cookie-auth-contract

## Current Phase

09-auth-and-shell — `docs/phases/09-auth-and-shell/PLAN.md`

## Current Task

T9. 공유 링크 신규 진입 초대 티저

## Status

REVIEW

## Progress

- 초대 머리(ShareInvite)를 신규·기존 방문자 공통으로, 선택 영역 분리 ✓
- SajuForm 섹션 머리글 · ShareInputScreen 문구(30:5916) ✓
- 테스트 · 목 모드 화면 확인 ✓ → PR ←

## Last Checkpoint

`1ba8c1e`

## Relevant Documents

- `docs/phases/09-auth-and-shell/PLAN.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/features/friends/ShareInvite.tsx` · `ShareEntryChoice.tsx`
- `src/features/saju/SajuForm.tsx:SajuForm` · `src/app/screens/ShareInputScreen.tsx`
- `src/app/routes/share.routes.tsx:ShareInputRoute`

## Next Action

PR 리뷰. 다음 09/T10(공유 궁합 결과).
