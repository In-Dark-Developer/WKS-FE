# Current State — 10-T13-reroll-sheet-copy

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 10-T13-reroll-sheet-copy
- Owner: nicerjs23@gmail.com
- Branch: ws/10-T13-reroll-sheet-copy
- Task: 10/T13
- Issue: none
- Touches: src/features/dating/recommendation/RerollSheet.tsx
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-design-tokens, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture, 2026-09-24-ci-sync-warn, 2026-09-24-dating-publishing-split, 2026-09-24-prd-completion-fields, 2026-09-25-cookie-auth-contract, 2026-09-27-dating-request-cancelled

## Current Phase

10-dating-onboarding — `docs/phases/10-dating-onboarding/PLAN.md`

## Current Task

T13. 리롤 시트 실 문구

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- Figma 시트(112:3773 무료 o · 112:3675 무료 x)를 직접 읽어 문구 대조 — 본문·취소 버튼은 이미 같았고 유료 버튼 어순만 달랐다
- 고침: `실 N개로 지금 변경하기`(Figma 어순) · 부족 안내에 필요한 개수를 넣음. 숫자는 서버 `rerollCost` 다
- 비용 확정값은 **20**(2026-09-28 소유자 확인) — 문서·목의 5 를 20 으로 맞추는 일은 별 스트림 ←

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`d29f1e8`

## Relevant Documents

- `docs/phases/10-dating-onboarding/PLAN.md` T13 · Figma v1.0 리롤 시트 `112:3773`·`112:3675`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/features/dating/recommendation/RerollSheet.tsx` (+`DatingCards.test.tsx`·`DatingCardsScreen.test.tsx` 문구 기대값)

## Next Action

PR 리뷰. 이어서 비용 20 을 문서·목에 반영하는 스트림을 연다.
