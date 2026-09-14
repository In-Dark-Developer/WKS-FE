# Current State — 04-T8-result-figma

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 04-T8-result-figma
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/04-T8-result-figma
- Task: 04/T8
- Issue: none
- Touches: src/features/saju/ReadingResult.tsx, src/features/saju/ReadingResult.test.tsx, src/features/saju/readingView.ts, src/features/saju/sections/, src/features/friends/map/FriendRanking.tsx, src/ui/DestinyCard.css, src/ui/DestinyCard.tsx, src/ui/DestinyCard.test.tsx, src/app/preview/screens/card.tsx, src/app/preview/screens/reading.tsx, src/app/routes.test.tsx, src/features/saju/ReadingResult.css, src/features/share/card/ResultCard.tsx, src/features/share/card/ConnectionCard.css, docs/phases/04-share-and-card/PLAN.md
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-cloudflare-pages, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-form-owner-change, 2026-09-13-hosting-domains, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-workers-static-assets, 2026-09-14-aws-cloudfront-hosting, 2026-09-14-domain-threadoffate, 2026-09-14-netlify-personal-fork, 2026-09-14-result-ownership

## Current Phase

04-share-and-card — `docs/phases/04-share-and-card/PLAN.md`

## Current Task

T8. 결과 화면을 Figma 사주 카드 화면(658:5075)에 맞추기

## Status

BLOCKED

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- [x] 1. 레이아웃: 콘텐츠 349(좌우 13), 카드 349×461, 인스타 버튼·순위 좌우 8 안쪽 333 (commit 2f07677)
- [x] 2. 행운 아이템→장소, 운세 연애→결혼→자녀 간격 24, 카드 배경·테두리 ·  FriendRanking RankingList 모양 · 설명 칸 폭 297·140자 · 제목 맞춤 상수 312
- [x] 3. test 258·typecheck·lint · 375px 좌표 Figma 대조
- [ ] 4. #97 병합됨 → main 병합 → --ready → PR ←

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`937f531`

## Relevant Documents

- Figma 658:5075 · `docs/phases/04-share-and-card/PLAN.md` T8 · `docs/PRD.md` FR-3

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/features/saju/ReadingResult.tsx` · `src/ui/DestinyCard.css` · `src/features/friends/map/FriendRanking.tsx`

## Next Action

#97 병합 뒤 `git merge origin/main` → `scripts/ai-end.sh --ready` → PR.
