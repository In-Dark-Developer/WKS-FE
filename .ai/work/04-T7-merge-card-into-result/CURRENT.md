# Current State — 04-T7-merge-card-into-result

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 04-T7-merge-card-into-result
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/04-T7-merge-card-into-result
- Task: 04/T7
- Issue: none
- Touches: src/app/routes.tsx, src/app/routes.test.tsx, src/features/saju/ReadingResult.tsx, src/features/saju/ReadingResult.test.tsx, src/features/share/, src/app/preview/screens/card.tsx, src/app/preview/screens/reading.tsx, src/ui/DestinyCard.css, src/ui/DestinyCard.tsx, src/ui/DestinyCard.test.tsx
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-cloudflare-pages, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-form-owner-change, 2026-09-13-hosting-domains, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-workers-static-assets, 2026-09-14-aws-cloudfront-hosting, 2026-09-14-domain-threadoffate, 2026-09-14-netlify-personal-fork, 2026-09-14-result-ownership

## Current Phase

04-share-and-card — `docs/phases/04-share-and-card/PLAN.md`

## Current Task

T7. 인연카드를 결과 화면에 합치기

## Status

BLOCKED

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- [x] 1. share ResultCard(뒤집기+인스타 공유)·앞면 운명 카드·cardLoader 삭제 · saju renderCard · routes 조립·카드 라우트 삭제 (commit 737b218, WIP)
- [x] 2. DestinyCard 말줄임 제거·connection kind 정리 · preview · test 252·typecheck·lint
- [x] 3. 긴 제목: 글자 수(--title-chars)로 글자 크기 축소, 8종·120자·360/430px 겹침 없음 (commit bf9795f)
- [ ] 4. PLAN SHA · --ready ←

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`f24d050`

## Relevant Documents

- `docs/phases/04-share-and-card/PLAN.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- (아직 없음)

## Next Action

`scripts/ai-end.sh --ready` → 소유자 확인 후 PR.
