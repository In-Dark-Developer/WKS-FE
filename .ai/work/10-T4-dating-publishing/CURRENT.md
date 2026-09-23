# Current State — 10-T4-dating-publishing

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: 10-T4-dating-publishing
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/10-T4-dating-publishing
- Task: 10/T4
- Issue: none
- Touches: src/features/dating/, src/ui/, src/app/preview/screens/
- Supersedes: none
- Acked: 2026-09-11-bootstrap,2026-09-12-board-rows-for-streams,2026-09-12-commit-type-ci,2026-09-12-design-first-prd,2026-09-12-notion-board-sync,2026-09-12-pr-body-autofill,2026-09-13-backend-contract-r2,2026-09-13-backend-contract,2026-09-13-cloudflare-pages,2026-09-13-design-tokens,2026-09-13-drop-birth-region,2026-09-13-form-owner-change,2026-09-13-hosting-domains,2026-09-13-issue-link,2026-09-13-notion-index-sync,2026-09-13-opacity-tokens,2026-09-13-planning-feedback,2026-09-13-publishing-first,2026-09-13-screen-ownership,2026-09-13-server-state-session,2026-09-13-session-module-owner,2026-09-13-session-token-and-contact,2026-09-13-task-after,2026-09-13-workers-static-assets,2026-09-14-aws-cloudfront-hosting,2026-09-14-domain-threadoffate,2026-09-14-netlify-personal-fork,2026-09-14-result-ownership,2026-09-22-netlify-org-repo,2026-09-23-dev-default-branch,2026-09-23-prd-notion-db,2026-09-23-prd-owner-drift,2026-09-23-prd-split,2026-09-23-v1-architecture,2026-09-24-dating-publishing-split

## Current Phase

10-dating-onboarding — `docs/phases/10-dating-onboarding/PLAN.md`

## Current Task

T4. 소개팅 화면 퍼블리싱

## Status

IN_PROGRESS

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- 1. ui 표현 컴포넌트 BottomSheet·ProfileCard·ThreadCount·Avatar·BlurredPhoto + 테스트 (done)
- 2. dating/intro — 인트로(비로그인·로그인)·카카오 로그인 시트 (done)
- 3. dating/profile — 2단계 폼(zod 검증, onSubmit) (done)
- 4. dating/recommendation — 헤더(실 잔액)·Top 3 카드 앞/뒷면·인연x·리롤 시트 ←
- 5. preview 화면 3개(dating-intro·dating-profile·dating-cards)
- 6. test·typecheck·lint, PLAN [x], 종료 절차

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`fb3e1e0`

## Relevant Documents

- `docs/phases/10-dating-onboarding/PLAN.md`
- `docs/prd/30-functional-requirements.md` FR-24~27·31 · `docs/prd/20-screens.md` SCR-15~17
- Figma `imSnlOGTqwtPhGyzhA8yc9` 76:3402 · 76:3401

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- (아직 없음)

## Next Action

Progress 의 ← step 을 이어 구현한다.
