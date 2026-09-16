# Handoff — chore-orb-raster-assets

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-17
- Phase / Task: -/-

## Goal

iOS Safari·카카오톡 인앱에서 궁합 지도 구슬과 순위 배지 가장자리가 깨지지 않는다.

## Work Completed

- `src/ui/assets/orbs/` SVG 8종을 헤드리스 크롬으로 3배 해상도 PNG(투명 배경)로 구워 교체, `tiers.ts` import 변경

## Work In Progress

- 없음

## Files Changed

- `src/ui/assets/orbs/*.png`(+8) · `*.svg`(-8) · `src/features/friends/map/tiers.ts`

## Decisions Made

- 원인은 SVG 필터(feMorphology·feGaussianBlur)를 WebKit 이 img 안에서 1배 해상도로 계산하는 것 — 정지 이미지로 비교해 확정
- CSS 그림자 재현 대신 PNG — 배지의 overlay 블렌드 inner shadow 를 CSS 로 정확히 옮길 수 없고, 크롬 표시와 픽셀 단위로 같다

## Tests Executed

- pnpm test·lint·typecheck (exit code) · iOS 시뮬레이터: 원본/필터 제거/crispEdges 제거/CSS 비교 페이지, 교체 후 지도·순위 캡처

## Test Results

- 모두 exit 0 · 교체 후 iOS 구슬·배지 가장자리 매끈

## Known Problems

- 색·크기를 바꾸려면 Figma 에서 SVG 를 다시 내보내 같은 방식으로 구워야 한다

## Unverified Assumptions

- 없음

## Exact Next Action

PR merge 후 없음.
