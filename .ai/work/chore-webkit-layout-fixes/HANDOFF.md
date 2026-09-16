# Handoff — chore-webkit-layout-fixes

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-16
- Phase / Task: -/-

## Goal

iOS Safari·카카오톡 인앱(WebKit)에서 결과 카드가 넘치지 않고, 상태 화면 제목이 좁은 화면에서도 한 줄이다.

## Work Completed

- 카드 뒤집기 그리드 칸을 `minmax(0, 1fr)` 로 고정 — WebKit 이 칸을 넓혀 카드가 왼쪽 끝으로 밀리고 넘쳤다
- 카드 비율을 패딩 없는 패널(323×439)로 옮김 — WebKit 이 세로 padding 을 더해 카드가 약 23pt 늘었다
- `ContentState` 제목 nowrap + `min(24px, 칸 폭 비례)`

## Work In Progress

- 없음

## Files Changed

- `src/features/share/card/ConnectionCard.css` · `src/ui/DestinyCard.css` · `src/ui/state/ContentState.tsx` · `src/ui/state/ContentState.css`

## Decisions Made

- 제목은 줄바꿈 대신 좁은 화면에서만 글자를 줄인다 — 가장 긴 기본 제목(297px@24px) 기준

## Tests Executed

- test·lint·typecheck·build (exit code) · iOS 시뮬레이터 iPhone 17e: 카드 앞·뒷면, 지도, 사전신청 모달 · 크롬 카드 치수·제목 줄 수 측정

## Test Results

- 모두 exit 0 · iOS 카드 13–377pt(크롬과 동일) · 제목 320/360/390px 모두 1줄

## Known Problems

- 카카오톡 인앱 고유 요인(툴바 높이·안드로이드 글자 크기)은 시뮬레이터로 재현되지 않는다

## Unverified Assumptions

- 없음

## Exact Next Action

카카오톡 실기기 스크린샷으로 남은 가운데 정렬·넘침을 확인한다.
