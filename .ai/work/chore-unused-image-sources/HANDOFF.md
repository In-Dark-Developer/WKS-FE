# Handoff — chore-unused-image-sources

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-15
- Phase / Task: -/-

## Goal

앱이 쓰지 않는 원본 이미지가 저장소에서 빠진다(소유자 요청 2026-09-15).

## Work Completed

- `src/ui/assets/og.png`(1.2MB, OG 원본 — 서비스는 `public/og/og-v2.jpg`)·`src/ui/assets/elephant.png`(335KB, 파비콘 원본 — 서비스는 `public/favicon.png`) 삭제 (commit 077762e)

## Work In Progress

- 없음

## Files Changed

- `src/ui/assets/og.png` · `src/ui/assets/elephant.png` (삭제)

## Decisions Made

- #107 에서 실수로 함께 커밋된 파일이다. git 이력의 blob 은 남는다(push 된 이력은 다시 쓰지 않는다)
- 소유자가 작업 트리에서 먼저 지웠다 — 그 삭제를 그대로 커밋

## Tests Executed

- `src/`·`docs/`·`index.html` 에서 파일 이름 참조 grep · `pnpm build`

## Test Results

- 참조 없음, build 성공

## Known Problems

- 없음

## Unverified Assumptions

- 없음

## Exact Next Action

PR 병합
