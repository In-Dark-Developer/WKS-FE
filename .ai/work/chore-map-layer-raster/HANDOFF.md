# Handoff — chore-map-layer-raster

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-28
- Phase / Task: -/-

## Goal

카카오 로그인 복귀처럼 페이지를 새로 연 궁합 지도에서도 궤도 선·달이 곧바로 보이고 움직임이 멈추지 않는다.

## Work Completed

- 원인: 궤도 선 4장·달이 그림자 블러·노이즈 필터 SVG 라, 폰(3배)에서 그리는 데 데스크톱 Chrome 기준 장당 1~4초(합 약 11초) — 로그인 복귀는 전체 페이지 새로 열기라 매번 처음부터 그렸고 그동안 선·달이 비고 합성이 막혀 움직임도 멈췄다
- 원본 SVG 를 Chrome 으로 3배 래스터 → 투명 가장자리를 중심 기준 정사각으로 잘라 WebP(q85). 레이어 중심은 그대로, r 만 자른 크기로(246→177 등)
- 그리기 1~5ms/장. 지도 배경 위 합성 비교 평균 차 1/255 미만
- 옛 SVG 5장 삭제, 회귀 테스트(레이어 5장이 .webp)

## Work In Progress

- 없음

## Files Changed

- `src/features/friends/map/{CompatibilityMap.tsx,CompatibilityMapScreen.test.tsx,orbLayout.ts}` · `src/ui/assets/backgrounds/compatibility-{orbit-1..4,moon}.{svg→webp}`

## Decisions Made

- 3배 해상도 유지(폰 DPR 3) + 빈 가장자리 자르기로 디코드 메모리를 2배 해상도 수준(약 45MB)으로
- 전송량은 SVG 합 약 240KB → WebP 합 약 850KB 로 늘지만 그리기 비용이 수백 배 준다

## Tests Executed

- `pnpm test` · `typecheck` · `lint` · 목 모드 `/preview` 눈 확인

## Test Results

- 전부 통과, 경고 0

## Known Problems

- 친구 2명 지도는 PRD FR-8(#297 결정)대로 구슬도 선도 움직이지 않는다 — QA 캡처(친구 2명)의 '구슬이 안 돈다'는 이 규칙이다

## Unverified Assumptions

- 없음

## Exact Next Action

PR 리뷰.
