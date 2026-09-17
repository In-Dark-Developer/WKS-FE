# Current State — chore-instagram-inapp-external

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: chore-instagram-inapp-external
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/chore-instagram-inapp-external
- Task: -/-
- Issue: none
- Touches: src/lib/inAppBrowser.ts,src/lib/inAppBrowser.test.ts,src/main.tsx,docs/ARCHITECTURE.md#Persistence
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract-r2, 2026-09-13-backend-contract, 2026-09-13-cloudflare-pages, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-form-owner-change, 2026-09-13-hosting-domains, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-workers-static-assets, 2026-09-14-aws-cloudfront-hosting, 2026-09-14-domain-threadoffate, 2026-09-14-netlify-personal-fork, 2026-09-14-result-ownership

## Current Phase

— (Task 밖 스트림)

## Current Task

chore: instagram-inapp-external

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 1. inAppBrowser.ts 인스타 iOS·Android 분기 + 테스트 — 완료 (9e594ee)
- 2. main.tsx 함수 이름 교체 — 완료 (9e594ee)
- 3. ARCHITECTURE Persistence 문장 갱신 — 완료 (9e594ee)
- 4. test·typecheck·lint 통과 → PR

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`9e594ee`

## Relevant Documents

- `AGENTS.md` · `docs/decisions/ADR-20260914-result-ownership-in-browser.md`

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/main.tsx` · `src/lib/inAppBrowser.ts:externalBrowserUrl`

## Next Action

병합 후 인스타그램 인앱 iOS(17 이상·16 이하)·Android 실기기에서 자기 공유 링크를 열어 기본 브라우저로 넘어가는지 확인한다.
