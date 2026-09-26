# Handoff — 09-T7-teaser-every-visit

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-26
- Phase / Task: 09/T7

## Goal

`/` 로 접속할 때마다 메인 티저가 먼저 보이고, 같은 접속 안의 앱 안 이동으로는 다시 보이지 않는다.

## Work Completed

- `introSeen.ts` 티저 지남을 localStorage(`wks:teaser-passed`) 대신 모듈 메모리로 — 새 접속마다 초기화
- PRD FR-1 에 2026-09-26 소유자 확정 추가

## Work In Progress

- 없음

## Files Changed

- `src/features/intro/introSeen.ts` · `src/features/intro/IntroGate.test.tsx` · `src/app/routes/index.test.tsx` · `docs/prd/30-functional-requirements.md`

## Decisions Made

- 인트로 영상은 그대로 첫 방문에만. 공유 링크(`/s/...`) 진입은 바뀌지 않는다. `/` 밖 경로로 들어오면 티저는 없다

## Tests Executed

- `pnpm test`·`typecheck`·`lint` · 로컬 브라우저: intro-seen·옛 teaser-passed 가 있어도 새로고침하면 티저

## Test Results

- 통과

## Known Problems

- 기존 사용자 브라우저에 `wks:teaser-passed` 키가 남지만 더 읽지 않는다

## Unverified Assumptions

- 없음

## Exact Next Action

없음.
