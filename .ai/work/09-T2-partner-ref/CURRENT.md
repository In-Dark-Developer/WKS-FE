# Current State — 09-T2-partner-ref

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 09-T2-partner-ref
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/09-T2-partner-ref
- Task: 09/T2
- Issue: none
- Touches: src/features/auth/, src/api/, docs/api/openapi.yaml, src/app/RootLayout.tsx
- Supersedes: 09-T2-kakao-cookie-login
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract-r2, 2026-09-13-backend-contract, 2026-09-13-cloudflare-pages, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-form-owner-change, 2026-09-13-hosting-domains, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-workers-static-assets, 2026-09-14-aws-cloudfront-hosting, 2026-09-14-domain-threadoffate, 2026-09-14-netlify-personal-fork, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture, 2026-09-24-ci-sync-warn, 2026-09-24-dating-publishing-split, 2026-09-24-prd-completion-fields, 2026-09-25-cookie-auth-contract

## Current Phase

09-auth-and-shell — `docs/phases/09-auth-and-shell/PLAN.md`

## Current Task

T2. 카카오 로그인과 쿠키 세션

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 1. 제휴 코드 보관(`?ref=`)·로그인 요청에 싣기 · 로그인 상태면 `POST /wallet/partner-rewards` (commit bd7658d) ✓
- 2. openapi 동기화 — partner-rewards · ref · rewardGranted (commit c4a7d43) ✓
- 3. test 689/689 · typecheck · lint ✓

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`d050455`

## Relevant Documents

- `docs/phases/09-auth-and-shell/PLAN.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/features/auth/partnerRef.ts` · `src/features/auth/kakaoLogin.ts:completeKakaoLogin` · `src/api/wallet.ts:claimPartnerReward` · `src/app/RootLayout.tsx`

## Next Action

PR 병합 뒤 dev 에서 `?ref=FESTIVAL` 로 로그인해 지급 모달 확인(실제 모드). T2 체크는 인앱 브라우저 로그인 완주 확인 뒤.
