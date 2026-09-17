# Current State — chore-kakao-inapp-external

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: chore-kakao-inapp-external
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/chore-kakao-inapp-external
- Task: -/-
- Issue: none
- Touches: src/lib/inAppBrowser.ts,src/lib/inAppBrowser.test.ts,src/main.tsx,docs/ARCHITECTURE.md#Persistence
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract-r2, 2026-09-13-backend-contract, 2026-09-13-cloudflare-pages, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-form-owner-change, 2026-09-13-hosting-domains, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-workers-static-assets, 2026-09-14-aws-cloudfront-hosting, 2026-09-14-domain-threadoffate, 2026-09-14-netlify-personal-fork, 2026-09-14-result-ownership

## Current Phase

— (Task 밖 스트림)

## Current Task

chore: kakao-inapp-external

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 1. src/lib/inAppBrowser.ts + 테스트 — 완료 (48171b0)
- 2. src/main.tsx 렌더 전 이동 — 완료 (48171b0)
- 3. ARCHITECTURE Persistence 한 줄 — 완료 (48171b0)
- 4. test·typecheck·lint 통과 → PR

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`11f58fe`

## Relevant Documents

- `AGENTS.md` · `docs/decisions/ADR-20260914-result-ownership-in-browser.md` — 인앱·기본 브라우저 저장소 분리를 감수한 결정

## Relevant Source Files

- `src/main.tsx` · `src/lib/inAppBrowser.ts:kakaoTalkExternalUrl`

## Next Action

PR 리뷰·병합 대기. 병합 후 실기기(카카오톡 iOS·Android)에서 공유 링크를 열어 기본 브라우저로 넘어가는지 확인한다.
