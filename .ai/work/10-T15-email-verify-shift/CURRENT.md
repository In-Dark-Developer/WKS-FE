# Current State — 10-T15-email-verify-shift

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 10-T15-email-verify-shift
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/10-T15-email-verify-shift
- Task: 10/T15
- Issue: none
- Touches: src/features/dating/profile/EmailVerification.tsx, src/features/dating/profile/DetailsStep.tsx
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract-r2, 2026-09-13-backend-contract, 2026-09-13-cloudflare-pages, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-form-owner-change, 2026-09-13-hosting-domains, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-workers-static-assets, 2026-09-14-aws-cloudfront-hosting, 2026-09-14-domain-threadoffate, 2026-09-14-netlify-personal-fork, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture, 2026-09-24-ci-sync-warn, 2026-09-24-dating-publishing-split, 2026-09-24-prd-completion-fields, 2026-09-25-cookie-auth-contract, 2026-09-27-dating-request-cancelled

## Current Phase

10-dating-onboarding — `docs/phases/10-dating-onboarding/PLAN.md`

## Current Task

T15. 학교 메일 코드 발송 뒤 화면 흔들림

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 1. 재현 — 375px 미리보기에서 재발송 버튼 폭이 매초 111.4~113.9px 로 바뀜 ✓
- 2. 테스트 — 수정 전 실패 확인 ✓
- 3. 수정 `tabular-nums` (commit f794755) — 114.4px 고정 ✓
- 4. test 693/693 · typecheck · lint ✓

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`c678726`

## Relevant Documents

- `docs/phases/10-dating-onboarding/PLAN.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/features/dating/profile/EmailVerification.tsx:SendButton` · `src/features/dating/profile/EmailVerification.test.tsx`

## Next Action

PR 병합
