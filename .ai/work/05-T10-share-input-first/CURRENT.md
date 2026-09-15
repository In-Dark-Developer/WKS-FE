# Current State — 05-T10-share-input-first

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 05-T10-share-input-first
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/05-T10-share-input-first
- Task: 05/T10
- Issue: none
- Touches: src/app/routes.tsx, src/app/routes.test.tsx, src/api/pendingShare.ts, src/api/pendingShare.test.ts, src/api/joinedShares.ts, src/api/joinedShares.test.ts, src/features/saju/SajuForm.tsx, src/features/saju/SajuForm.test.tsx, src/features/saju/sajuAction.ts, src/features/saju/sajuAction.test.ts, src/features/saju/index.ts, src/features/friends/shareMapLoader.ts, src/features/friends/joinShareLoader.ts, src/features/friends/shareInputLoader.ts (각 *.test.ts), src/features/friends/index.ts, src/features/friends/map/CompatibilityMapScreen.tsx, src/features/friends/map/CompatibilityMapScreen.test.tsx, src/ui/assets/icons/angle-small-left.svg, src/app/preview/screens/map.tsx
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-cloudflare-pages, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-form-owner-change, 2026-09-13-hosting-domains, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-workers-static-assets, 2026-09-14-aws-cloudfront-hosting, 2026-09-14-domain-threadoffate, 2026-09-14-netlify-personal-fork, 2026-09-14-result-ownership

## Current Phase

05-friend-score — `docs/phases/05-friend-score/PLAN.md`

## Current Task

T10. 공유 링크 입력 먼저로 재조립

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 1. `pendingShare` → `joinedShares` (done) · 2. `createSajuAction`(다음 경로 주입, async) · `SajuForm` 문구 props·결과 대기 화면 (done)
- 3. loader: 입력(건너뛰면 궁합 후 replace 지도)·지도·join(재시도 전용) (done)
- 4. 지도 뒤로가기 슬롯 · routes · preview (commit 7851f37)
- 5. 뒤로가기 기록 버그 수정(궁합을 action·입력 loader 가 직접) · mock 브라우저 흐름 확인 (commit b44fa5d) → PR ←

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`b44fa5d`

## Relevant Documents

- `docs/phases/05-friend-score/PLAN.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- (아직 없음)

## Next Action

PR 리뷰(@nicerjs23 `src/features/`·`src/api/` · @gn00py48 `src/ui/` 아이콘) → 병합(fork 소유자) → 실기기 공유 흐름(SC-3)
