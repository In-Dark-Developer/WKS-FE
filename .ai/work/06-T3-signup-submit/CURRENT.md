# Current State — 06-T3-signup-submit

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 06-T3-signup-submit
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/06-T3-signup-submit
- Task: 06/T3
- Issue: none
- Touches: src/api/results.ts,src/api/session.ts,src/features/saju/readingLoader.ts,.claude/launch.json,src/api/signups.ts,src/api/schema/signups.ts,src/features/profile/,src/features/saju/SajuForm.tsx,src/ui/TermsSheet.tsx,src/app/routes.tsx,src/app/preview/screens/pre-register.tsx,src/lib/analytics.ts,docs/api/openapi.yaml,docs/PRD.md,docs/phases/06-dating-gate/PLAN.md
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-14-result-ownership

## Current Phase

06-dating-gate — `docs/phases/06-dating-gate/PLAN.md`

## Current Task

T3. 사전신청 제출 연동

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 1. 죽은 resultId 를 비운다 — getResult 404 → forgetSession (commit beb8669)
- 2. signups API·폼(연락처 택1·성별 세그먼트·약관 시트)·라우트·티저 (commit 2fa73e6)
- 3. spec 갱신 (commit 82be5ca) → PR → CI 통과 시 merge ←

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`82be5ca`

## Relevant Documents

- `docs/phases/06-dating-gate/PLAN.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/api/signups.ts:createSignup` · `src/api/session.ts:forgetSession`
- `src/features/profile/preRegisterAction.ts:preRegisterAction` · `:PreRegisterForm` · `:PreRegisterTeaser` · `:VerifyComplete`
- `src/ui/TermsSheet.tsx:TermsSheet` · `src/app/routes.tsx:PreRegisterModalRoute`

## Next Action

PR CI 통과 → merge → 백엔드 확장분 운영 배포 확인 후 실제 신청 1건으로 점검
