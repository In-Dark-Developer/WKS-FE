# Handoff — chore-ci-parallel-tests

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-15
- Phase / Task: -/-

## Goal

CI 대기 시간을 줄이되 test·typecheck·lint 는 그대로 필수로 둔다.

## Work Completed

- ci.yml: `check` matrix(test·typecheck·lint, fail-fast 끔) 병렬, 필수 검사 이름 `commands` 는 needs 집계 job 으로 유지
- vitest.config.ts: `pool: 'vmThreads'` (commit 7e7e0cf)

## Work In Progress

- 없음

## Files Changed

- `.github/workflows/ci.yml` · `vitest.config.ts`

## Decisions Made

- `isolate: false` 는 13개 테스트가 상태 누수로 깨져 기각
- job 이름 `commands` 를 집계로 남겨 ai-stream.sh setup 의 required_status_checks 와 맞춘다

## Tests Executed

- `npx vitest run --maxWorkers=2` 기본·vmThreads(3회)·threads·no-isolate 비교 · `pnpm test`·`typecheck`·`lint`

## Test Results

- 기본 13.9s · vmThreads 2.6~3.1s(264 통과) · threads 12.6s · no-isolate 13 failed

## Known Problems

- vmThreads 는 워커당 메모리를 더 쓴다 — 테스트가 크게 늘면 다시 잰다

## Unverified Assumptions

- CI(2 vCPU)에서도 비슷한 비율로 줄어든다 — PR 실행으로 확인

## Exact Next Action

PR CI 시간 확인 후 결과 보고.
