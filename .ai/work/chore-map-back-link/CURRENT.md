# Current State — chore-map-back-link

- Stream: chore-map-back-link
- Owner: nicerjs23@gmail.com
- Branch: ws/chore-map-back-link
- Task: -/-
- Issue: none
- Touches: src/app/routes.tsx,src/app/routes.test.tsx,src/features/friends/map/CompatibilityMapScreen.tsx,src/features/friends/map/CompatibilityMapScreen.test.tsx,src/app/preview/screens/map.tsx
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-cloudflare-pages, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-form-owner-change, 2026-09-13-hosting-domains, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-workers-static-assets, 2026-09-14-aws-cloudfront-hosting, 2026-09-14-domain-threadoffate, 2026-09-14-netlify-personal-fork, 2026-09-14-result-ownership

## Current Phase

— (Task 밖 스트림)

## Current Task

chore: map-back-link

## Status

REVIEW

## Progress

- 1. 뒤로가기 공통 컴포넌트 확인 — 없음(routes.tsx 인라인) → 그 마크업을 `BackRow` 로 모음
- 2. `CompatibilityMapScreen` 에 `back` 슬롯(결과 화면 720:3587 과 같은 줄·간격)
- 3. `protectedMapLoader` 가 `myResultId` 를 넘기고 `/me/map` 뒤로가기가 내 결과로 이동
- 4. 테스트 3개(지도 화면 2·라우트 1), `/preview` 상태 추가
- 5. test 354|typecheck|lint 통과, 목 dev + playwright 로 이동 확인 ←

## Last Checkpoint

`143a471`

## Relevant Documents

- Figma 720:3587(결과 화면 뒤로가기 줄) · `docs/PRD.md` SCR-08 · FR-6

## Relevant Source Files

- `src/app/routes.tsx:BackRow,CompatibilityMapRoute,protectedMapLoader` · `src/features/friends/map/CompatibilityMapScreen.tsx:Props.back`

## Next Action

소유자 push·PR 승인 대기.
