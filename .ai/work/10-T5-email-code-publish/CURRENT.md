# Current State — 10-T5-email-code-publish

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 10-T5-email-code-publish
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/10-T5-email-code-publish
- Task: 10/T5
- Issue: none
- Touches: src/features/dating/, src/ui/, src/app/preview/screens/
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-design-tokens, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture, 2026-09-24-ci-sync-warn, 2026-09-24-dating-publishing-split, 2026-09-24-prd-completion-fields, 2026-09-25-cookie-auth-contract, 2026-09-27-dating-request-cancelled

## Current Phase

10-dating-onboarding — `docs/phases/10-dating-onboarding/PLAN.md`

## Current Task

T5. 학교 메일 코드 인증 퍼블리싱

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 1. `SCHOOL_EMAIL_DOMAIN` + profileSchema 도메인 검사·테스트
- 2. 코드 인증 UI(`EmailVerification`) 이후 버전용 보관, 선택 prop · /preview 상태
- 3. test·typecheck·lint·브라우저 확인

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`146612c`

## Relevant Documents

- `docs/phases/10-dating-onboarding/PLAN.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/features/dating/profile/profileSchema.ts:detailsStepSchema`
- `src/features/dating/profile/EmailVerification.tsx:EmailVerification`

## Next Action

`docs/phases/10-dating-onboarding/PLAN.md`에서 10/T5의 Done when·Acceptance Criteria를 확인하고 HANDOFF의 Goal·Work In Progress를 쓴 뒤 시작한다.
