# Current State — 02-T5-app-shell-route

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 02-T5-app-shell-route
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/02-T5-app-shell-route
- Task: 02/T5
- Issue: none
- Touches: src/app/App.tsx,src/app/App.test.tsx
- Supersedes: 02-T5-app-shell
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-planning-feedback, 2026-09-13-session-token-and-contact, 2026-09-13-task-after

## Current Phase

02-design-system — `docs/phases/02-design-system/PLAN.md`

## Current Task

T5. 앱 셸 레이아웃

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- [x] App 진입점에서 AppShell로 RouterProvider 감싸기
- [x] 라우트 콘텐츠가 셸 안에 렌더되는 테스트 추가
- [x] test·typecheck·lint와 localhost 360·375·430px 실측

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`8eff5f0`

## Relevant Documents

- `docs/phases/02-design-system/PLAN.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/app/App.tsx:App`
- `src/app/App.test.tsx`

## Next Action

종료 기록을 커밋하고 최신 main 병합 후 PR을 연다.
