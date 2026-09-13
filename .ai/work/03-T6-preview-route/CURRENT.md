# Current State — 03-T6-preview-route

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 03-T6-preview-route
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/03-T6-preview-route
- Task: 03/T6
- Issue: none
- Touches: src/app/App.tsx, src/app/preview/
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-form-owner-change, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after

## Current Phase

03-saju-reading — `docs/phases/03-saju-reading/PLAN.md`

## Current Task

T6. 퍼블리싱 확인 라우트

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 -->
- 1. 화면 등록 규약(PreviewScreen)·glob 목록
- 2. /preview 목록·화면·상태 전환·화면별 action
- 3. App.tsx DEV 전용 lazy 연결
- 4. SajuForm 첫 화면 등록
- 5. 테스트·빌드 산출물 검사

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`17512a9`

## Relevant Documents

- `docs/phases/03-saju-reading/PLAN.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/app/App.tsx:App`
- `src/app/AppShell.tsx:AppShell`
- `src/features/saju/SajuForm.tsx:SajuForm`
- `src/app/preview/previewScreen.ts:PreviewScreen`
- `src/app/preview/PreviewRoute.tsx:PreviewRoute`

## Next Action

Progress 의 step 구현
