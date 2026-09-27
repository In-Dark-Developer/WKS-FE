# Current State — 10-T7-mbti-field-color

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 10-T7-mbti-field-color
- Owner: nicerjs23@gmail.com
- Branch: ws/10-T7-mbti-field-color
- Task: 10/T7
- Issue: none
- Touches: src/features/dating/profile/DetailsStep.tsx, src/ui/Select.tsx
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-design-tokens, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture, 2026-09-24-ci-sync-warn, 2026-09-24-dating-publishing-split, 2026-09-24-prd-completion-fields, 2026-09-25-cookie-auth-contract, 2026-09-27-dating-request-cancelled

## Current Phase

10-dating-onboarding — `docs/phases/10-dating-onboarding/PLAN.md`

## Current Task

T7. 프로필 (2/2) MBTI 칸 색

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 원인: 옆 TextField 는 `className="bg-surface-default"` 로 흰 배경을 덮어쓰는데, Select 는 `className` 이 **감싸는 div** 로 가서 칸에 닿지 않았다
- 고침: Select 의 `className` 을 여는 칸(트리거)에 붙이고, (2/2) MBTI 에 같은 배경을 준다
- 테스트: Select className 위치 · MBTI·학과 배경 같음 · 검증 4종 · PR ←
- 같은 문제가 (1/2) 태어난 시간 칸에도 있다 — Touches 밖이라 손대지 않고 보고

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`933c06c`

## Relevant Documents

- `docs/phases/10-dating-onboarding/PLAN.md` T7 · Figma v1.0 사주입력폼 (2/2) `134:3639`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/ui/Select.tsx`(className → 트리거) · `src/features/dating/profile/DetailsStep.tsx` (+각 테스트)

## Next Action

PR 리뷰(`src/ui/` Owner @gn00py48 확인 필요). 다음은 10/T8·T9·T10 카드.
