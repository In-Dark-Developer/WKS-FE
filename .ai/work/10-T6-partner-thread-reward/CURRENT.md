# Current State — 10-T6-partner-thread-reward

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 10-T6-partner-thread-reward
- Owner: nicerjs23@gmail.com
- Branch: ws/10-T6-partner-thread-reward
- Task: 10/T6
- Issue: none
- Touches: src/features/dating/, src/api/, src/app/routes/
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-design-tokens, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture, 2026-09-24-ci-sync-warn, 2026-09-24-dating-publishing-split, 2026-09-24-prd-completion-fields, 2026-09-25-cookie-auth-contract, 2026-09-27-dating-request-cancelled

## Current Phase

10-dating-onboarding — `docs/phases/10-dating-onboarding/PLAN.md`

## Current Task

T6. 협업 링크 실 지급

## Status

IN_PROGRESS

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 1. api: 로그인 응답의 `rewardGranted` 를 한 번만 꺼내 쓰는 보관소(`src/api/rewards.ts`) ←
- 2. feature: 지급 모달(SCR-23 1.2) — 지급량·보유 수, 닫으면 다시 뜨지 않는다
- 3. route: 소개팅 진입에서 대기 중인 지급이 있으면 띄운다 · 잔액은 `/wallet` 을 다시 읽는다
- 4. test/typecheck/lint · 커밋 · `--ready`
- 보류: `ref` 를 로그인 요청에 싣는 일은 09/T2(features/auth, 이정진)가 넘긴다 — 지금은 `ref: null`

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`832b007`

## Relevant Documents

- `docs/phases/10-dating-onboarding/PLAN.md` T6 · `docs/prd/30-functional-requirements.md` FR-32 · `20-screens.md` SCR-23
- Figma v1.0 「축사 연결」 228:3318 (1.2 로그인 성공 228:4441)

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/api/auth.ts:loginWithKakao` · `schema/auth.ts:kakaoLoginResultSchema` · `src/api/wallet.ts:getWallet`
- `src/features/dating/DatingDialog.tsx`(재사용) · `entry/datingEntry.ts` · `src/app/routes/dating.routes.tsx`

## Next Action

Progress 1 — 지급 보관소.
