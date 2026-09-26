# Current State — 10-T2-dating-thread-wallet

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 10-T2-dating-thread-wallet
- Owner: nicerjs23@gmail.com
- Branch: ws/10-T2-dating-thread-wallet
- Task: 10/T2
- Issue: none
- Touches: src/features/dating/, src/api/, docs/api/openapi.yaml
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-design-tokens, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture, 2026-09-24-ci-sync-warn, 2026-09-24-dating-publishing-split, 2026-09-24-prd-completion-fields, 2026-09-25-cookie-auth-contract

## Current Phase

10-dating-onboarding — `docs/phases/10-dating-onboarding/PLAN.md`

## Current Task

T2. 재화 '실'

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 1~5 완료 (commit 8792afa·dbf0d20) — openapi §12 · wallet.ts · 목 원장 정렬 · 잔액 단일 출처 · 검증
- 6~7. dev 병합(11/T2 #228) 충돌 정리 · PR·강근우님 전달 ←

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`dbf0d20`

## Relevant Documents

- `docs/phases/10-dating-onboarding/PLAN.md` T2 · `docs/prd/30-functional-requirements.md` FR-31
- WKS-BE `docs/api-spec.md` §12 실(재화) (dev adf54ab)

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/api/me.ts:mockBalance,spendMockThread` · `src/api/unlocks.ts` (11/T1 이 만든 차감 경로)
- `src/features/dating/recommendation/recommendationsLoader.ts:datingCardsLoader` · `DatingCardsScreen.tsx`

## Next Action

`ai-end.sh --ready` 로 PR. 강근우님께 handoff 노트 전달(소유자 승인 완료).
