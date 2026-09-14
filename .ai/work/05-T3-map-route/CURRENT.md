# Current State — 05-T3-map-route

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 05-T3-map-route
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/05-T3-map-route
- Task: 05/T3
- Issue: none
- Touches: src/app/routes.tsx, src/app/routes.test.tsx, src/api/schema/result.ts, src/api/schema/result.test.ts, src/features/saju/readingView.ts, src/features/saju/toReadingView.ts, src/features/saju/toReadingView.test.ts, src/features/friends/, src/app/preview/screens/map.tsx, src/api/results.ts, src/api/results.test.ts, src/app/requireSession.ts, src/features/saju/readingLoader.test.ts, src/features/share/link/ShareLinkButton.tsx, src/features/share/link/ShareLinkButton.test.tsx, src/app/preview/screens/reading.tsx, docs/phases/05-friend-score/PLAN.md
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-cloudflare-pages, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-form-owner-change, 2026-09-13-hosting-domains, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-workers-static-assets, 2026-09-14-aws-cloudfront-hosting, 2026-09-14-domain-threadoffate, 2026-09-14-netlify-personal-fork, 2026-09-14-result-ownership

## Current Phase

05-friend-score — `docs/phases/05-friend-score/PLAN.md`

## Current Task

T3. 궁합 지도 라우트와 결과 화면 '지도 보기'

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- [x] 1. compatibilities 스키마를 백엔드 실제 모양(score·tier·originNickname·guestNickname)으로
- [x] 2. toReadingView: 상대 닉네임(내 닉네임 아닌 쪽)·점수 높은 순 friends
- [x] 3. /me/map 라우트(requireMyResultId + 결과 loader 재사용) · CompatibilityMapScreen share 슬롯 · ShareLinkButton label
- [x] 4. 결과 화면 순위 제목 줄 '지도 보기 >' (FriendRanking headerAction) (commit ea218bd)
- [x] 5. test 264·typecheck·lint · 목 모드 입력→결과→지도 보기→/me/map
- [ ] 6. --ready → PR ←

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`4b9bb89`

## Relevant Documents

- `docs/phases/05-friend-score/PLAN.md` T3 · `docs/PRD.md` FR-8·FR-18 · `docs/api/openapi.yaml` CompatibilitySummary

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/app/routes.tsx:protectedMapLoader` · `src/features/saju/toReadingView.ts:toFriends` · `src/api/schema/result.ts:compatibilitySummarySchema`

## Next Action

PR #99 병합 대기.
