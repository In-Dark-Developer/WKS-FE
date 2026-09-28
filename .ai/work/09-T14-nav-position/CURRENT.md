# Current State — 09-T14-nav-position

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 09-T14-nav-position
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/09-T14-nav-position
- Task: 09/T14
- Issue: none
- Touches: src/app/layout.css, src/app/screens/BottomNavBar.tsx, src/features/dating/
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-design-tokens, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture, 2026-09-24-ci-sync-warn, 2026-09-24-dating-publishing-split, 2026-09-24-prd-completion-fields, 2026-09-25-cookie-auth-contract, 2026-09-27-dating-request-cancelled

## Current Phase

09-auth-and-shell — `docs/phases/09-auth-and-shell/PLAN.md`

## Current Task

T14. 소개팅 이동 시 하단 네비 위치 고정

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 재현: 네 화면 네비 위치 측정 — 스크롤 없는 요청함에서 셸·네비 7.5px 이동(상시 스크롤바)
- :root scrollbar-gutter: stable, 375px 네 화면 동일 확인

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`e9f6ee2`

## Relevant Documents

- `docs/phases/09-auth-and-shell/PLAN.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/app/layout.css:root`

## Next Action

PR 병합. 상시 스크롤바 데스크톱(Windows·macOS 스크롤바 항상 표시)에서 실측.
