# Handoff — 08-T2-fork-sync-push

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-14
- Phase / Task: 08/T2

## Goal

`sync-fork` 가 fork 전용 fine-grained 토큰으로 fork `main` 을 upstream 과 같게 만든다.

## Work Completed

- 원인: merge-upstream API 는 토큰이 upstream(조직 private)도 읽어야 하는데 fine-grained 토큰은 소유자 하나(개인)만 → 403
- 수정: GITHUB_TOKEN 으로 main 전체 이력 체크아웃 → fork 토큰으로 `git push --force HEAD:main`(extraheader, add-mask)
- `docs/deploy/netlify-fork.md` 토큰 설명·fork 직접 커밋 금지, PLAN T2 문구

## Work In Progress

- 없음

## Files Changed

- `.github/workflows/sync-fork.yml`, `docs/deploy/netlify-fork.md`, 08 PLAN

## Decisions Made

- classic PAT(repo 전체 권한) 대신 fork 전용 토큰 + push — 최소 권한
- ADR 본문의 merge-upstream 표현은 구현 세부라 ADR 은 고치지 않음(워크플로우·운영 문서가 기준)

## Tests Executed

- `gh workflow run sync-fork.yml --ref ws/08-T2-fork-sync-push` (run 34767429785)

## Test Results

- success, fork main = upstream main 932b8f0

## Known Problems

- fork 에서 직접 커밋하면 다음 동기화에서 덮어써진다

## Unverified Assumptions

- 없음

## Exact Next Action

PR 리뷰 후 병합
