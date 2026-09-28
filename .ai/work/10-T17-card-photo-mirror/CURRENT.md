# Current State — 10-T17-card-photo-mirror

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 10-T17-card-photo-mirror
- Owner: nicerjs23@gmail.com
- Branch: ws/10-T17-card-photo-mirror
- Task: 10/T17
- Issue: none
- Touches: src/ui/ProfileCard.tsx, src/ui/ProfileCard.css, src/ui/ProfileCard.test.tsx, docs/phases/10-dating-onboarding/PLAN.md, docs/phases/README.md
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract-r2, 2026-09-13-backend-contract, 2026-09-13-design-tokens, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture, 2026-09-24-prd-completion-fields, 2026-09-25-cookie-auth-contract

## Current Phase

10-dating-onboarding — `docs/phases/10-dating-onboarding/PLAN.md`

## Current Task

T17. 카드를 뒤집어도 사진은 그대로

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- [x] 거울 상이 어디서 오는지 찾는다 — 코드에 좌우 반전은 없고, 겹친 앞면이 비치는 것이다
- [x] 두 면에 접두사 붙은 backface-visibility 와 절반 뒤 숨김을 건다
- [x] 회귀 테스트 · test/typecheck/lint

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`833b64e`

## Relevant Documents

- `docs/phases/10-dating-onboarding/PLAN.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- (아직 없음)

## Next Action

`docs/phases/10-dating-onboarding/PLAN.md`에서 10/T17의 Done when·Acceptance Criteria를 확인하고 HANDOFF의 Goal·Work In Progress를 쓴 뒤 시작한다.
