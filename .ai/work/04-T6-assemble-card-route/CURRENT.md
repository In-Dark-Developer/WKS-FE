# Current State — 04-T6-assemble-card-route

- Stream: 04-T6-assemble-card-route
- Owner: nicerjs23@gmail.com
- Branch: ws/04-T6-assemble-card-route
- Task: 04/T6
- Issue: none
- Touches: src/app/routes.tsx, src/features/share/cardLoader.ts, src/features/share/index.ts, src/features/saju/readingView.ts, src/features/saju/toReadingView.ts
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-cloudflare-pages, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-form-owner-change, 2026-09-13-hosting-domains, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-workers-static-assets, 2026-09-14-aws-cloudfront-hosting, 2026-09-14-domain-threadoffate, 2026-09-14-netlify-personal-fork

## Current Phase

04-share-and-card — `docs/phases/04-share-and-card/PLAN.md`

## Current Task

T6. 결과 화면·라우트 조립

## Status

REVIEW

## Progress

- 1. `ReadingView`에 `shareId` 추가 + `toReadingView`가 전달
- 2. `src/features/share/cardLoader.ts`: `GET /results/{id}` → 인연카드 화면 props(`CardView`)
- 3. `share/index.ts`에 `cardLoader`·`CardView` export
- 4. `routes.tsx`: `share` 슬롯에 인연카드 진입 + `ShareLinkButton`, `reading/:id/card` 라우트 등록
- 5. 테스트(cardLoader 404·503·성공, 라우트 진입·복귀, share 슬롯)
- 6. `pnpm test|typecheck|lint|build` + `pnpm dev` 실사용 확인
- 7. HANDOFF·LOG·PLAN(SHA) 정리 → 소유자 승인 후 push ←

## Last Checkpoint

`9d9b6db`

## Relevant Documents

- `docs/phases/04-share-and-card/PLAN.md` T6 · 공지 `2026-09-13-publishing-first`

## Relevant Source Files

- `src/features/share/card/ConnectionCardScreen.tsx:Props` · `src/features/share/link/ShareLinkButton.tsx`
- `src/features/saju/ReadingResult.tsx:Props.share` · `src/app/routes.tsx:ReadingResultRoute`
- `src/api/schema/result.ts:Result` · `src/features/saju/readingLoader.ts`(오류 처리 선례)

## Next Action

구현·테스트·브라우저 확인 끝. 소유자 push 승인 대기.
