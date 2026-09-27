# Current State — chore-dating-photo-rules

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: chore-dating-photo-rules
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/chore-dating-photo-rules
- Task: -/-
- Issue: none
- Touches: src/api/uploads.ts,src/api/uploads.test.ts,src/api/schema/dating.ts,docs/api/openapi.yaml,src/features/dating/profile/
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-design-tokens, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture, 2026-09-24-ci-sync-warn, 2026-09-24-dating-publishing-split, 2026-09-24-prd-completion-fields, 2026-09-25-cookie-auth-contract, 2026-09-27-dating-request-cancelled

## Current Phase

— (Task 밖 스트림)

## Current Task

소개팅 사진 JPG·PNG·10MB 제한과 안내 문구

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- webp 제거(schema·openapi), 10MB 선검사, accept 좁힘, (2/2) 안내·오류 문구, 테스트

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`f41f06e`

## Relevant Documents

- `AGENTS.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/api/uploads.ts:uploadDatingPhoto`
- `src/features/dating/profile/DetailsStep.tsx:photoGuide`

## Next Action

PR 병합.
