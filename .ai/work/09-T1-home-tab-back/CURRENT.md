# Current State — 09-T1-home-tab-back

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 09-T1-home-tab-back
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/09-T1-home-tab-back
- Task: 09/T1
- Issue: none
- Touches: src/app/, src/ui/, docs/prd/30-functional-requirements.md
- Supersedes: 09-T1-bottom-nav
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract-r2, 2026-09-13-backend-contract, 2026-09-13-cloudflare-pages, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-form-owner-change, 2026-09-13-hosting-domains, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-workers-static-assets, 2026-09-14-aws-cloudfront-hosting, 2026-09-14-domain-threadoffate, 2026-09-14-netlify-personal-fork, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture, 2026-09-24-ci-sync-warn, 2026-09-24-dating-publishing-split, 2026-09-24-prd-completion-fields, 2026-09-25-cookie-auth-contract

## Current Phase

09-auth-and-shell — `docs/phases/09-auth-and-shell/PLAN.md`

## Current Task

T1. 하단 네비게이션과 홈 분기

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 1. 재현 — 같은 탭 재선택이 같은 주소를 push (프로브) ✓
- 2. 테스트 2건 — 수정 전 실패 확인 ✓
- 3. 수정 `BottomNavBar` (commit 03286e9) ✓
- 4. test 531/531 · typecheck · lint ✓

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`03286e9`

## Relevant Documents

- `docs/phases/09-auth-and-shell/PLAN.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/app/screens/BottomNavBar.tsx:BottomNavBar` · `src/app/routes/index.test.tsx` (하단 네비 절)

## Next Action

소유자가 PR 본문을 다듬어 올린다 (`scripts/ai-end.sh --ready` 초안).
