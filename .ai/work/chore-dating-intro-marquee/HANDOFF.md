# Handoff — chore-dating-intro-marquee

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude
- To: 없음
- Date: 2026-09-24
- Phase / Task: -/-

## Goal

소개팅 인트로 배경 카드가 1·3번 줄은 왼쪽, 2번 줄은 오른쪽으로 같은 간격을 유지하며 끝없이 흐른다.

## Work Completed

- 줄마다 카드 한 벌(4장)을 두 번 이어 붙이고 트랙 절반(한 벌 = 183px × 4)만큼 옮긴 뒤 처음으로 — 이음매 없음 (455596f)
- 간격은 gap 대신 카드마다 pr-12 — 두 벌 사이 간격도 12px
- 시작 지점은 Figma 에서 줄이 밀려 있던 거리(227·212·547px)를 음수 animation-delay 로 환산
- 한 바퀴 40s(`--card-wall-duration`), '동작 줄이기' 설정이면 멈춘다
- 줄 간격도 12px 로 통일(전엔 21·11px), 카드는 `WallCard` 하나로 세 줄 공통 171×216 (33dae92)

## Work In Progress

- 없음

## Files Changed

- 없음

## Decisions Made

- 속도는 한 벌 40초(약 18px/s) — 디자인에 값이 없어 정했다. 바꾸려면 dating.css 의 `--card-wall-duration` 한 곳

## Tests Executed

- 단위: 세 줄 방향 left·right·left, 줄마다 8장
- 브라우저 375×812: 카드 간격 12px × 7(이음매 포함), 애니메이션 시각이 실제로 흐르고 2번 줄이 오른쪽으로 가다 한 벌 끝에서 이어짐

## Test Results

- 통과. typecheck·lint 경고 없음

## Known Problems

- 없음

## Unverified Assumptions

- 없음

## Exact Next Action

병합 후 09/T4 로 돌아간다.
