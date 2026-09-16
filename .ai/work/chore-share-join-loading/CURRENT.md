# Current State — chore-share-join-loading

- Stream: chore-share-join-loading
- Owner: nicerjs23@gmail.com
- Branch: ws/chore-share-join-loading
- Task: -/-
- Issue: none
- Touches: src/features/friends/ShareJoinLoading.tsx, src/features/friends/ShareJoinLoading.css, src/features/friends/ShareJoinLoading.test.tsx, src/features/friends/index.ts, src/app/routes.tsx, src/app/routes.test.tsx, src/app/layout.css, src/app/preview/screens/share-loading.tsx, src/ui/assets/elephant-loading.png
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-cloudflare-pages, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-form-owner-change, 2026-09-13-hosting-domains, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-workers-static-assets, 2026-09-14-aws-cloudfront-hosting, 2026-09-14-domain-threadoffate, 2026-09-14-netlify-personal-fork, 2026-09-14-result-ownership

## Current Phase

— (Task 밖 스트림)

## Current Task

chore: share-join-loading

## Status

REVIEW

## Progress

- 1. Figma 1044:4150 대조(그라데이션·Display/20/400·코끼리 130px·'... 애니메이션' 주석)
- 2. 코끼리 이미지 내려받아 260px PNG 로 넣음(표시 130px 의 2배)
- 3. `ShareJoinLoading` + 점 늘어남 CSS(동작 줄이기면 고정 '...')
- 4. `/s/:shareId`·`/join`·`/map` 첫 진입 대기 화면으로 등록
- 5. 테스트 4개·`/preview/share-loading`, 브라우저로 위치·애니메이션 확인
- 6. 소유자 확인 반영: 첫 방문자에겐 안 보임 · 글자 고정 · 점 `.`부터 · 리본 끔 ←

## Last Checkpoint

`42506c5`

## Relevant Documents

- Figma 「ui (기획 확인용)」 [최종] 링크 공유 시 친구가 보이는 화면 1044:4150 · `docs/PRD.md` SCR-06

## Relevant Source Files

- `src/features/friends/ShareJoinLoading.tsx` · `src/app/routes.tsx:shareJoinLoadingScreen` · `src/features/friends/shareInputLoader.ts`

## Next Action

소유자 push·PR 승인 대기.
