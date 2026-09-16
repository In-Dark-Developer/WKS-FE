# Current State — chore-share-loading-min-time

- Stream: chore-share-loading-min-time
- Owner: nicerjs23@gmail.com
- Branch: ws/chore-share-loading-min-time
- Task: -/-
- Issue: none
- Touches: src/app/routes.tsx,src/app/routes.test.tsx
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-cloudflare-pages, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-form-owner-change, 2026-09-13-hosting-domains, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-workers-static-assets, 2026-09-14-aws-cloudfront-hosting, 2026-09-14-domain-threadoffate, 2026-09-14-netlify-personal-fork, 2026-09-14-result-ownership

## Current Phase

— (Task 밖 스트림)

## Current Task

chore: share-loading-min-time

## Status

REVIEW

## Progress

- 1. 대기 화면이 loader 끝나면 바로 사라지는 구조 확인
- 2. `shareEntryLoader` 로 공유 링크 loader 를 감싸 최소 1.5초 유지(결과 있는 사람만)
- 3. 테스트 1개 추가, 최소 대기로 느려진 기존 테스트 2개의 대기 시간 조정
- 4. 목 dev + 브라우저로 보인 시간·첫 방문자 영향 측정 ←

## Last Checkpoint

`95c32a6`

## Relevant Documents

- 소유자 지시(2026-09-17): 공유 화면을 1~2초는 보여 준다 · Figma 1044:4150

## Relevant Source Files

- `src/app/routes.tsx:shareEntryLoader,ShareEntryFallback` · `src/features/friends/shareInputLoader.ts`

## Next Action

소유자 push·PR 승인 대기.
