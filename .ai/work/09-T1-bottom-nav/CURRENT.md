# Current State — 09-T1-bottom-nav

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 09-T1-bottom-nav
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/09-T1-bottom-nav
- Task: 09/T1
- Issue: none
- Touches: src/app/, src/ui/, index.html, docs/prd/30-functional-requirements.md
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract-r2, 2026-09-13-backend-contract, 2026-09-13-design-tokens, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture

## Current Phase

09-auth-and-shell — `docs/phases/09-auth-and-shell/PLAN.md`

## Current Task

T1. 하단 네비게이션과 홈 분기

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- ui/BottomNav + 아이콘 3개 + 네비 색 토큰
- app/screens/BottomNavBar, route handle `nav`, RootLayout·AppShell 연결, /dating 자리
- 레이아웃: 하단 여백·Safe Area(viewport-fit=cover)·토스트 위치 (Figma nav 30:5661 기준)
- 테스트: BottomNav 단위 + 라우트 노출·분기 — test·typecheck·lint·브라우저 375×812 확인

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`6d2b29b`

## Relevant Documents

- `docs/phases/09-auth-and-shell/PLAN.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/ui/BottomNav.tsx` · `src/app/screens/BottomNavBar.tsx` · `src/app/RootLayout.tsx` · `src/app/AppShell.tsx` · `src/app/layout.css` · `src/app/routes/*.routes.tsx`

## Next Action

`docs/phases/09-auth-and-shell/PLAN.md`에서 09/T1의 Done when·Acceptance Criteria를 확인하고 HANDOFF의 Goal·Work In Progress를 쓴 뒤 시작한다.
