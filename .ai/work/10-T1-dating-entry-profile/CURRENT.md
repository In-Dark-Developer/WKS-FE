# Current State — 10-T1-dating-entry-profile

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->
- Stream: 10-T1-dating-entry-profile
- Owner: nicerjs23@gmail.com
- Branch: ws/10-T1-dating-entry-profile
- Task: 10/T1
- Issue: none
- Touches: src/features/dating/, src/app/routes/, src/api/, docs/api/openapi.yaml, docs/phases/10-dating-onboarding/PLAN.md
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-design-tokens, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-14-result-ownership, 2026-09-22-netlify-org-repo, 2026-09-23-dev-default-branch, 2026-09-23-prd-notion-db, 2026-09-23-prd-owner-drift, 2026-09-23-prd-split, 2026-09-23-v1-architecture, 2026-09-24-dating-publishing-split, 2026-09-24-prd-completion-fields

## Current Phase
10-dating-onboarding — `docs/phases/10-dating-onboarding/PLAN.md`

## Current Task
T1. 소개팅 진입과 프로필 등록

## Status

BLOCKED

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 1~7 완료 (목 데이터, commit 2ee9119) — 진입 분기·프로필 (1/2)·(2/2)·사진·저장·실패 유지
- 8. 로그인 연결 — 09/T2 병합 뒤 `dating.routes.tsx` 의 목 로그인/로그아웃을 features/auth 로 교체 ← 대기
- 9. 프로필 저장 실제 호출 — 백엔드 `/api/dating/**` 명세 뒤 `src/api/dating.ts`·`schema/dating.ts`·openapi
- 10. `--ready` (PR)

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`2ee9119`

## Relevant Documents

- `docs/phases/10-dating-onboarding/PLAN.md`
- `docs/prd/30-functional-requirements.md` FR-24·25 · `20-screens.md` SCR-15~17 · 백엔드 api.md §6(미추적 사본)

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/features/dating/intro/DatingIntro.tsx:DatingIntro` · `profile/DatingProfileForm.tsx:DatingProfileForm` · `profile/profileSchema.ts`
- `src/features/dating/entry/{datingEntry,profileLoader}.ts` · `DatingIntroScreen.tsx` · `DatingProfileScreen.tsx`
- `src/api/me.ts:getMe` · `dating.ts:saveDatingProfile` · `uploads.ts:uploadPhoto` · `results.ts:getResultInput` · `src/app/routes/dating.routes.tsx` · `guards.ts:requireAuth`

## Next Action

BLOCKED — 09/T2 로그인 병합과 백엔드 dating 명세를 기다린다. 풀리면 Progress 8·9.
