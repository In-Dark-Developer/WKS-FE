# Current State — 03-T3-route-session

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 03-T3-route-session
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/03-T3-route-session
- Task: 03/T3
- Issue: #28
- Touches: src/app/routes.tsx,src/app/routes.test.tsx,src/app/requireSession.ts,src/app/RouteError.tsx,src/app/RouteError.test.tsx,src/app/RouteLoading.tsx,src/api/session.ts,src/api/session.test.ts,docs/phases/03-saju-reading/PLAN.md,.ai/team/announcements/,.ai/team/README.md
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-planning-feedback, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-server-state-session, 2026-09-13-screen-ownership, 2026-09-13-session-module-owner

## Current Phase

03-saju-reading — `docs/phases/03-saju-reading/PLAN.md`

## Current Task

T3. 라우트 등록 + 세션 안내

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 1. PLAN T3 Touches 에 `api/session.ts` 이동, 공지
- 2. `session.ts` read/write/clear + zod·스토리지 예외 테스트
- 3. `requireSession` loader, `RouteError`·`RouteLoading`(ContentState)
- 4. routes 트리(root errorElement·HydrateFallback, index, reading/:id 가드, 예약 주석)
- 5. test 44·typecheck·lint·build, 브라우저 리다이렉트·404 확인

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`cc0ebd7`

## Relevant Documents

- `docs/phases/03-saju-reading/PLAN.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/app/routes.tsx:routes` · `src/app/requireSession.ts:requireSession`
- `src/api/session.ts:readSession` · `src/app/RouteError.tsx:RouteError`

## Next Action

PR 병합. T4·T5 병합 시 Placeholder 를 각 화면으로 교체(T3 소유 파일 — 재오픈 또는 후속 Task)
