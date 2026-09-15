# Handoff — chore-map-orb-fade

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: @nicerjs23 (`src/features/` Owner — 리뷰)
- Date: 2026-09-15
- Phase / Task: -/-

## Goal

흐르는 구슬이 궤도 길이에 맞게 지도 가장자리까지 흐르다 옅어진다 — 바깥 궤도(스침)일수록 끝부분에서 길게 옅어진다(소유자 요청 2026-09-15).

## Work Completed

- `orbLayout.ts`: 보이는 호를 두 칸으로 — 멈춘 자리는 제목·닉네임을 비운 칸(24~299 × 96~400), 흐름은 패널 전체(0~323 × 0~439). 흐름 호: 귀인 104°(272px)·찰떡 102°(372px)·벗 86°(405px)·스침 63°(359px, 전 26°)
- `CompatibilityMap.css`: 옅어짐 폭을 호의 12% → 모든 궤도 10° — px 로 귀인 26·찰떡 36·벗 47·스침 57 (commit afa5b1a)
- PRD FR-8

## Work In Progress

- 없음

## Files Changed

- `src/features/friends/map/orbLayout.ts`(+test) · `CompatibilityMap.css` · `docs/PRD.md`

## Decisions Made

- 소유자 선택: 보이는 호를 지도 끝까지 늘리고 옅어지는 폭은 궤도 둘레에 비례(같은 각도) · 흐르는 구슬은 제목 뒤로 지나갈 수 있다

## Tests Executed

- `pnpm test`·`typecheck`·`lint`·`build` · 목 서버 `/preview/map` 24명 6초 시점 스크린샷

## Test Results

- test 322 passed, 경고 없음 · 스침이 왼쪽 가장자리에서 오른쪽 가장자리까지 흐르다 옅어짐, 콘솔 오류 없음

## Known Problems

- 흐르는 구슬·닉네임이 제목·부제 글자 위를 지나간다(겹치는 순간 읽기 어렵다) · 귀인·찰떡 호 끝(0°)은 패널 아래 가장자리라 닉네임이 먼저 잘린다

## Unverified Assumptions

- 없음

## Exact Next Action

PR 병합
