# Current State — chore-intro-video

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: chore-intro-video
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/chore-intro-video
- Task: -/-
- Issue: none
- Touches: docs/PRD.md,docs/ARCHITECTURE.md,src/features/intro/,src/app/routes.tsx,src/app/routes.test.tsx,src/ui/assets/video/
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-cloudflare-pages, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-form-owner-change, 2026-09-13-hosting-domains, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-workers-static-assets, 2026-09-14-aws-cloudfront-hosting, 2026-09-14-domain-threadoffate, 2026-09-14-netlify-personal-fork

## Current Phase

— (Task 밖 스트림)

## Current Task

chore: intro-video

## Status

IN_PROGRESS

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 1. PRD FR-1·Non-goals, ARCHITECTURE Persistence 를 인트로 포함으로 갱신 ←
- 2. `src/features/intro/` IntroVideo(8초 영상, 2초 뒤 건너뛰기)·IntroGate(첫 방문 1회 저장)와 테스트
- 3. `routes.tsx` index 를 IntroGate 로 감싸고 routes 테스트 갱신
- 4. test·typecheck·lint·브라우저 확인 → 커밋 → PR 준비

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`b2cafc9`

## Relevant Documents

- `docs/PRD.md` (FR-1, Non-goals) · `docs/ARCHITECTURE.md` (Persistence)
- `docs/decisions/ADR-20260913-server-state-and-session-storage.md` (세션 키 규칙 — 인트로 키는 별개)

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `src/app/routes.tsx:routes` (index)
- `src/ui/assets/video/intro.mp4` (406×720, 8초, h264+aac)

## Next Action

spec 갱신 후 intro feature 구현
