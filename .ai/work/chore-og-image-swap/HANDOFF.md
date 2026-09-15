# Handoff — chore-og-image-swap

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-15
- Phase / Task: -/-

## Goal

공유 링크 미리보기 이미지가 소유자가 교체한 1200×630 이미지로 바뀐다.

## Work Completed

- `src/ui/assets/og.png` 교체본(1200×630) 반영, `public/og/og.jpg` 를 같은 크기 JPEG 85 로 재생성, `index.html` `og:image:height` 675 → 630 (commit 4c0de0c)

## Work In Progress

- 없음

## Files Changed

- `index.html` · `public/og/og.jpg` · `src/ui/assets/og.png`

## Decisions Made

- 이미지가 이미 1.91:1 이라 자르거나 줄이지 않고 JPEG 로만 바꿨다

## Tests Executed

- `pnpm build`

## Test Results

- build 성공

## Known Problems

- 없음

## Unverified Assumptions

- 배포 뒤 메신저 미리보기 — 미확인

## Exact Next Action

PR 병합 → 카카오 공유 디버거 캐시 초기화 후 확인
