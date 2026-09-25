# Current State — 10-T3-dating-top3-reroll

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 10-T3-dating-top3-reroll
- Owner: nicerjs23@gmail.com
- Branch: ws/10-T3-dating-top3-reroll
- Task: 10/T3
- Issue: none
- Touches: src/features/dating/, src/ui/
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-design-tokens, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture, 2026-09-24-ci-sync-warn, 2026-09-24-dating-publishing-split, 2026-09-24-prd-completion-fields, 2026-09-25-cookie-auth-contract

## Current Phase

10-dating-onboarding — `docs/phases/10-dating-onboarding/PLAN.md`

## Current Task

T3. Top 3 추천과 리롤

## Status

IN_PROGRESS

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 1. openapi: `GET /dating/recommendations` (WKS-BE §10.4) ←
- 2. api: `getRecommendations` + 목 3명 · 리롤은 BE 미구현이라 목 전용
- 3. feature: 응답 → `DatingCardsView` 변환(잠금 항목·순위 문구·잔액) + 테스트
- 4. route `/dating/cards`: 카드·리롤 시트 연결, 403 DATING_NOT_VERIFIED·0명 상태
- 5. test/typecheck/lint · 커밋 · `--ready`

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`f5d5f3a`

## Relevant Documents

- `docs/phases/10-dating-onboarding/PLAN.md` T3 · `docs/prd/30-functional-requirements.md` FR-26·27·31 · NFR-4
- WKS-BE `docs/api-spec.md` §10.4 추천 (dev 5ec80d2) — 리롤·해금·썸네일은 미구현

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/features/dating/recommendation/{cardsView.ts,DatingCards.tsx,RerollSheet.tsx}` (퍼블리싱 10/T4)
- `src/api/dating.ts` · `src/api/schema/dating.ts` · `src/app/routes/dating.routes.tsx`

## Next Action

Progress 1 — openapi 에 추천 계약 반영.
