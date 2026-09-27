# Current State — spec-prd-reroll-cost-20

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: spec-prd-reroll-cost-20
- Owner: nicerjs23@gmail.com
- Branch: ws/spec-prd-reroll-cost-20
- Task: -/-
- Issue: none
- Touches: docs/prd/30-functional-requirements.md,docs/api/openapi.yaml,src/api/dating.ts,src/features/dating/recommendation/
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-design-tokens, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture, 2026-09-24-ci-sync-warn, 2026-09-24-dating-publishing-split, 2026-09-24-prd-completion-fields, 2026-09-25-cookie-auth-contract, 2026-09-27-dating-request-cancelled

## Current Phase

— (Task 밖 스트림)

## Current Task

spec: prd-reroll-cost-20

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- PRD FR-27 · openapi 설명 · 목 리롤 비용을 20 으로 (2026-09-28 소유자 확인, Figma 시안도 20)
- 목 계정 실(가입 10)로는 20 을 낼 수 없어 목 유료 리롤은 402 로 막힌다 — 테스트를 그 규칙으로 고쳤다
- 검증 4종 + redocly · PR ←

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`73d3ef5`

## Relevant Documents

- `docs/prd/30-functional-requirements.md` FR-27 · `docs/api/openapi.yaml` `/dating/recommendations/reroll`
- Figma v1.0 리롤 시트 `112:3675`('실 20개로 지금 변경하기') · WKS-BE `DatingRecommendationService.REROLL_COST`(현재 5, 변경 예정)

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/api/dating.ts:REROLL_PAID_COST`(목) · `src/features/dating/recommendation/recommendationsLoader.ts`(주석)

## Next Action

PR 리뷰. 백엔드가 REROLL_COST 를 20 으로 바꾸면 실제 모드도 맞는다.
