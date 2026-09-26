# Current State — 11-T2-thread-inbox

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 11-T2-thread-inbox
- Owner: gn00py48@gmail.com
- Branch: ws/11-T2-thread-inbox
- Task: 11/T2
- Issue: none
- Touches: src/features/dating/, src/app/routes/, src/api/matchRequests.ts, src/api/matchRequests.test.ts, src/api/schema/matchRequests.ts
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract-r2, 2026-09-13-backend-contract, 2026-09-13-cloudflare-pages, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-form-owner-change, 2026-09-13-hosting-domains, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-workers-static-assets, 2026-09-14-aws-cloudfront-hosting, 2026-09-14-domain-threadoffate, 2026-09-14-netlify-personal-fork, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture, 2026-09-24-ci-sync-warn, 2026-09-24-dating-publishing-split, 2026-09-24-prd-completion-fields, 2026-09-25-cookie-auth-contract

## Current Phase

11-dating-thread — `docs/phases/11-dating-thread/PLAN.md`

## Current Task

T2. 운명의 실과 요청함

## Status

REVIEW

## Progress

- api `matchRequests.ts` — 보내기·목록·수락·거절 (WKS-BE §11, openapi #213) + 목 ✓
- 카드: 운명의 실 보내기(미해금 있으면 확인) → 보낸 뒤 모달, 보낸 상대는 해금·재전송 막기 (FR-29) ✓
- `/dating/requests` 요청함: 보낸·받은 신청, 수락·거절, 성립 시 연락처 (FR-30) ✓ — 받은 신청 프로필·취소는 BE 갭
- 테스트 558 통과 · typecheck · lint ✓ → PR (#225 위에 쌓음) ←

## Last Checkpoint

`bbde9a8`

## Relevant Documents

- `docs/phases/11-dating-thread/PLAN.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/features/dating/recommendation/DatingCardsScreen.tsx` · `recommendationsLoader.ts`
- `src/features/dating/requests/RequestInbox.tsx` · `RequestDetail.tsx` · `requestsView.ts`
- `src/app/routes/dating.routes.tsx:datingRoutes`

## Next Action

#225(11/T1) 병합 뒤 이 PR 리뷰. BE 답(받은 신청 프로필·요청 취소·매칭 실패)이 오면 이어서 고친다.
