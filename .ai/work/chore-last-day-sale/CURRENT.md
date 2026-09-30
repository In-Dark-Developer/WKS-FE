# Current State — chore-last-day-sale

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: chore-last-day-sale
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/chore-last-day-sale
- Task: -/-
- Issue: none
- Touches: src/features/dating/card/,src/features/dating/unlock/,src/features/dating/recommendation/RerollSheet.tsx,src/features/dating/recommendation/RerollSheet.test.tsx,src/ui/LockedValue.tsx,src/app/preview/screens/
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract-r2, 2026-09-13-backend-contract, 2026-09-13-cloudflare-pages, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-form-owner-change, 2026-09-13-hosting-domains, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-workers-static-assets, 2026-09-14-aws-cloudfront-hosting, 2026-09-14-domain-threadoffate, 2026-09-14-netlify-personal-fork, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture, 2026-09-24-ci-sync-warn, 2026-09-24-dating-publishing-split, 2026-09-24-prd-completion-fields, 2026-09-25-cookie-auth-contract, 2026-09-27-dating-request-cancelled, 2026-09-29-release-pr-ci, _template

## Current Phase

— (Task 밖 스트림)

## Current Task

chore: last-day-sale — 마지막 날(2026-10-01 10시~자정) 50% 할인 때 실 비용에 정가 취소선

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 1. 비용 표시 지점 파악(카드 알약·해금 모달·리롤 시트)
- 2. CostText 로 정가 취소선, 정가표 unlockView 로 이동
- 3. 테스트·미리보기 상태 추가, test/typecheck/lint
- 4. dev PR → dev 배포 확인 → release PR ←

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`36c1f94`

## Relevant Documents

- `AGENTS.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/features/dating/unlock/CostText.tsx:CostText`
- `src/features/dating/unlock/unlockView.ts:listedCost`
- `src/features/dating/card/CandidateFaces.tsx:CandidateBack`
- `src/features/dating/recommendation/RerollSheet.tsx:REROLL_LISTED_COST`

## Next Action

PR 병합 뒤 dev 배포에서 표시를 확인하고 dev → main 릴리스 PR 을 올린다.
