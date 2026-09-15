# Current State — 05-T7-share-flow

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 05-T7-share-flow
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/05-T7-share-flow
- Task: 05/T7
- Issue: none
- Touches: src/app/routes.tsx, src/app/routes.test.tsx, src/api/pendingShare.ts, src/api/pendingShare.test.ts, src/features/saju/sajuAction.ts, src/features/saju/sajuAction.test.ts, src/features/friends/shareMapLoader.ts, src/features/friends/joinShareLoader.ts (각 *.test.ts), src/features/friends/index.ts
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-cloudflare-pages, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-form-owner-change, 2026-09-13-hosting-domains, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-workers-static-assets, 2026-09-14-aws-cloudfront-hosting, 2026-09-14-domain-threadoffate, 2026-09-14-netlify-personal-fork, 2026-09-14-result-ownership

## Current Phase

05-friend-score — `docs/phases/05-friend-score/PLAN.md`

## Current Task

T7. 공유 링크 흐름 조립

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 1. `src/api/pendingShare.ts` — sessionStorage `wks:pending-share` (done)
- 2. `shareMapLoader`(`s/:shareId`) · `joinShareLoader`(`s/:shareId/join`) (done)
- 3. `sajuAction` join 분기 (done) · 4. `routes.tsx` 조립(방문자 지도·버튼·join 오류 화면) + 라우트 테스트 (commit 0a01628)
- 5. 운영 백엔드로 흐름 확인 (done) → PR ←

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`0a01628`

## Relevant Documents

- `docs/phases/05-friend-score/PLAN.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- (아직 없음)

## Next Action

PR 리뷰(@nicerjs23 `src/features/`·`src/api/` Owner) → 병합(fork 소유자) → 실기기 두 대로 SC-3
