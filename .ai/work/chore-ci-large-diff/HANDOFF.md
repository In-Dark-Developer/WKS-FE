# Handoff — chore-ci-large-diff

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-29
- Phase / Task: -/-

## Goal

변경 파일이 300개를 넘는 PR(dev → main 릴리스)에서도 commands 검사가 돈다.

## Work Completed

- 릴리스 PR #313 에서 `gh pr diff` 가 HTTP 406(too_large)으로 실패해 commands 가 빨갛게 끝났다 — 실패하면 코드 변경이 있는 것으로 보고 전체를 검사한다

## Work In Progress

- 없음

## Files Changed

- `.github/workflows/ci.yml` (commands · does this touch code?)

## Decisions Made

- 없음

## Tests Executed

- YAML 파싱 · 이 PR 의 CI

## Test Results

- YAML 정상

## Known Problems

- 없음

## Unverified Assumptions

- 없음

## Exact Next Action

PR 병합 → 릴리스 브랜치 갱신
