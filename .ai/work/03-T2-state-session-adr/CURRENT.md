# Current State — 03-T2-state-session-adr

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 03-T2-state-session-adr
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/03-T2-state-session-adr
- Task: 03/T2
- Issue: none
- Touches: docs/decisions/, docs/ARCHITECTURE.md, .ai/team/announcements/, .ai/team/README.md
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-planning-feedback, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-server-state-session

## Current Phase

03-saju-reading — `docs/phases/03-saju-reading/PLAN.md`

## Current Task

T2. 서버 상태 캐시·세션 보관 방식 ADR

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 1. 현재 라우터·의존성·PRD Q16·백엔드 계약(세션 1차 제외) 확인
- 2. ADR 작성 — loader/action, `api/session.ts` localStorage
- 3. ARCHITECTURE State·Persistence·External·Cross-cutting 갱신, 공지
- 4. 소유자 지시 반영 — 세션은 백엔드 토큰 하나, `resultId` 대체 경로 제거

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`834eaed`

## Relevant Documents

- `docs/phases/03-saju-reading/PLAN.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/app/App.tsx:createBrowserRouter` · `src/app/routes.tsx:routes`

## Next Action

PR 리뷰·병합. Q16 답이 오면 `session.ts`·`client.ts` 갱신 spec 스트림
