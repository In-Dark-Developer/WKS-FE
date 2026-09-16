# Handoff — chore-map-orb-crisp

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-16
- Phase / Task: -/-

## Goal

iOS Safari·카카오톡 인앱에서 궁합 지도 구슬 가장자리가 깨지지 않는다.

## Work Completed

- 구슬 img 를 `scale: 1.9412` 대신 원 지름 × 1.9412 크기로 그리고 음수 여백으로 흐름 크기를 원 지름에 맞춤

## Work In Progress

- 없음

## Files Changed

- `src/features/friends/map/CompatibilityMap.css`

## Decisions Made

- 원인: WebKit 이 움직이는(마스크·애니메이션) 레이어 안에서 SVG(흐림 필터)를 확대 전 크기로 구운 비트맵을 늘렸다

## Tests Executed

- pnpm test·lint·typecheck (exit code) · 크롬 390px 구슬·이름 위치 전후 측정 · iOS 시뮬레이터 iPhone 17e 캡처 전후

## Test Results

- 모두 exit 0 · 크롬 위치 변화 없음(이름 0.1px 이내) · iOS 구슬 가장자리 매끈

## Known Problems

- 없음

## Unverified Assumptions

- 없음

## Exact Next Action

PR merge 후 없음.
