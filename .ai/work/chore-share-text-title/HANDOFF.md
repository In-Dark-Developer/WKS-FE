# Handoff — chore-share-text-title

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-16
- Phase / Task: -/-

## Goal

카카오톡으로 공유한 문구가 제목·문구·링크 세 줄로 나뉘어 보인다.

## Work Completed

- `navigator.share` 에 title 을 따로 넘기지 않고 text 를 `제목\n문구\n링크` 로

## Work In Progress

- 없음

## Files Changed

- `src/features/share/link/shareLink.ts` · `shareLink.test.ts`

## Decisions Made

- title 을 빼서 메일 등 제목 칸을 쓰는 앱에서는 제목이 본문 첫 줄로 간다 — 카카오톡 표시를 우선했다

## Tests Executed

- pnpm test·lint·typecheck (exit code)

## Test Results

- 모두 exit 0

## Known Problems

- 없음

## Unverified Assumptions

- 카카오톡이 text 안의 줄바꿈을 그대로 보여준다 — 링크 줄바꿈(기존)이 동작하므로 같다고 본다

## Exact Next Action

배포 후 카카오톡 공유로 세 줄 표시를 확인한다.
