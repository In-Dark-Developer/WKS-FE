# Current State — chore-thread-guide-modal

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: chore-thread-guide-modal
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/chore-thread-guide-modal
- Task: -/-
- Issue: none
- Touches: src/api/wallet.ts,src/api/wallet.test.ts,src/app/RootLayout.tsx,src/app/RootLayout.test.tsx,src/features/dating/,src/ui/assets/dating/,src/app/preview/screens/
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-design-tokens, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture, 2026-09-24-ci-sync-warn, 2026-09-24-dating-publishing-split, 2026-09-24-prd-completion-fields, 2026-09-25-cookie-auth-contract, 2026-09-27-dating-request-cancelled

## Current Phase

— (Task 밖 스트림)

## Current Task

소개팅 top_nav 운명의 실 → 재화 안내 모달(Figma 295:3267), 접속 시 출석 자동 지급

## Status

TODO

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 모달·에셋, 헤더 버튼, 접속 출석(ensureDailyCheckIn), 카드 뷰 checkedInToday, 미리보기·테스트

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`8ccd7e4`

## Relevant Documents

- `AGENTS.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/features/dating/wallet/ThreadGuideDialog.tsx:ThreadGuideDialog`
- `src/api/wallet.ts:ensureDailyCheckIn`

## Next Action

PR 병합.
