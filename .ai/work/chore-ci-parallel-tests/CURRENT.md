# Current State — chore-ci-parallel-tests

<!-- 50줄 이내. Status: TODO | IN_PROGRESS | BLOCKED | REVIEW (DONE은 병합 여부로 도출). Progress는 step마다, 나머지는 세션 종료 시 갱신. 머리의 필드는 ai-stream.sh가 채운다. -->

- Stream: chore-ci-parallel-tests
- Owner: 98745092+jjjung0921@users.noreply.github.com
- Branch: ws/chore-ci-parallel-tests
- Task: -/-
- Issue: none
- Touches: .github/workflows/ci.yml,vitest.config.ts,tests/setup.ts
- Supersedes: none
- Acked: 2026-09-11-bootstrap, 2026-09-12-board-rows-for-streams, 2026-09-12-commit-type-ci, 2026-09-12-design-first-prd, 2026-09-12-notion-board-sync, 2026-09-12-pr-body-autofill, 2026-09-13-backend-contract, 2026-09-13-backend-contract-r2, 2026-09-13-cloudflare-pages, 2026-09-13-design-tokens, 2026-09-13-drop-birth-region, 2026-09-13-form-owner-change, 2026-09-13-hosting-domains, 2026-09-13-issue-link, 2026-09-13-notion-index-sync, 2026-09-13-opacity-tokens, 2026-09-13-planning-feedback, 2026-09-13-publishing-first, 2026-09-13-screen-ownership, 2026-09-13-server-state-session, 2026-09-13-session-module-owner, 2026-09-13-session-token-and-contact, 2026-09-13-task-after, 2026-09-13-workers-static-assets, 2026-09-14-aws-cloudfront-hosting, 2026-09-14-domain-threadoffate, 2026-09-14-netlify-personal-fork, 2026-09-14-result-ownership

## Current Phase

— (Task 밖 스트림)

## Current Task

chore: ci-parallel-tests

## Status

REVIEW

## Progress

<!-- 현재 Task의 step ≤ 10개. 진행 중인 step 끝에 ← -->
- [x] 1. ci.yml: test·typecheck·lint 를 matrix 병렬 job, 집계 job 'commands' 유지 (commit 7e7e0cf)
- [x] 2. vitest pool vmThreads 측정·적용 — 2 워커 13.9s → 2.6s, 3회 모두 264 통과
- [x] 3. PR CI: 전체 90s → 50s, test 단계 46s → 11s

## Last Checkpoint

<!-- 이 스트림의 마지막 close commit. `scripts/ai-end.sh --set-checkpoint`가 기록한다. -->
`7e7e0cf`

## Relevant Documents

- `AGENTS.md` Rule 8·Commands

## Relevant Source Files

<!-- 디렉터리가 아니라 파일·심볼 단위로: `src/api/users.py:create_user` -->
- `.github/workflows/ci.yml:check` · `vitest.config.ts`

## Next Action

PR #100 병합 대기.
