# Current State — chore-dating-card-back-qa

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: chore-dating-card-back-qa
- Owner: gn00py48@gmail.com
- Branch: ws/chore-dating-card-back-qa
- Task: -/-
- Issue: none
- Touches: src/features/dating/card/CandidateFaces.tsx,src/features/dating/card/CandidateFaces.test.tsx,src/features/dating/recommendation/DatingCardsScreen.tsx,src/features/dating/recommendation/DatingCardsScreen.test.tsx,src/features/dating/unlock/unlockFlow.ts,src/features/dating/unlock/unlockFlow.test.ts,src/ui/LockedValue.tsx,src/app/preview/screens/dating-cards.tsx
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract-r2, 2026-09-13-backend-contract, 2026-09-13-cloudflare-pages, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-form-owner-change, 2026-09-13-hosting-domains, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-workers-static-assets, 2026-09-14-aws-cloudfront-hosting, 2026-09-14-domain-threadoffate, 2026-09-14-netlify-personal-fork, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture, 2026-09-24-ci-sync-warn, 2026-09-24-dating-publishing-split, 2026-09-24-prd-completion-fields, 2026-09-25-cookie-auth-contract, 2026-09-27-dating-request-cancelled

## Current Phase

— (Task 밖 스트림)

## Current Task

chore: dating-card-back-qa

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 알약 가운데 · 궁합 이유 줄바꿈 · 해금 값 즉시 반영 · '다시 열기' ✓
- 테스트 · 미리보기 확인 → PR ←

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`643b936`

## Relevant Documents

- `AGENTS.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/features/dating/card/CandidateFaces.tsx:BackRow`
- `src/features/dating/recommendation/DatingCardsScreen.tsx:withPatch`
- `src/features/dating/unlock/unlockFlow.ts:applyUnlockedValues`

## Next Action

PR 리뷰.
