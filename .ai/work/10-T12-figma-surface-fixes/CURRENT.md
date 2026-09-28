# Current State — 10-T12-figma-surface-fixes

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 10-T12-figma-surface-fixes
- Owner: nicerjs23@gmail.com
- Branch: ws/10-T12-figma-surface-fixes
- Task: 10/T12
- Issue: none
- Touches: src/features/dating/recommendation/DatingHeader.tsx, src/ui/PhotoUpload.tsx, src/ui/Button.tsx, src/ui/tokens/theme.css, docs/phases/10-dating-onboarding/PLAN.md, docs/phases/README.md
- Supersedes: 10-T12-dating-top-nav
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract-r2, 2026-09-13-backend-contract, 2026-09-13-design-tokens, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture, 2026-09-24-dating-publishing-split, 2026-09-24-prd-completion-fields, 2026-09-25-cookie-auth-contract, 2026-09-27-dating-request-cancelled

## Current Phase

10-dating-onboarding — `docs/phases/10-dating-onboarding/PLAN.md`

## Current Task

T12. 소개팅 상단 바 아이콘

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- [x] Figma `91:1790` 에서 top_nav 원본 paint 를 읽는다 — 살구빛 10%, Rose/50 50% 가 아니다
- [x] Figma `134:3639` 에서 사진 추가 칸을 읽는다 — 흰 카드·311×393·Rose/300 버튼
- [x] 두 곳을 고치고 회귀 테스트를 붙인다

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`dcdeb05`

## Relevant Documents

- `docs/phases/10-dating-onboarding/PLAN.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- (아직 없음)

## Next Action

`docs/phases/10-dating-onboarding/PLAN.md`에서 10/T12의 Done when·Acceptance Criteria를 확인하고 HANDOFF의 Goal·Work In Progress를 쓴 뒤 시작한다.
