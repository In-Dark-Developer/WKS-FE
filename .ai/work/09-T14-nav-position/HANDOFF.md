# Handoff — 09-T14-nav-position

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-28
- Phase / Task: 09/T14

## Goal

홈·궁합지도·소개팅 사이를 오가도 하단 네비의 가로·세로 위치가 바뀌지 않는다.

## Work Completed

- :root scrollbar-gutter: stable (e9f6ee2)

## Work In Progress

- 없음

## Files Changed

- src/app/layout.css
- docs/phases/09-auth-and-shell/PLAN.md

## Decisions Made

- overflow-y: scroll(빈 트랙 상시 표시) 대신 scrollbar-gutter: stable — 겹치는 스크롤바 환경엔 영향 없음

## Tests Executed

- pnpm test · lint, 미리보기 375px 에서 네 화면 네비 x·y 측정, 스크롤바 강제 표시로 원인 재현

## Test Results

- 640 통과, 375px 에서 x 50.2 · y 728 동일

## Known Problems

- 이 환경은 스크롤바가 겹쳐 보여 수정 후 상시 스크롤바 실측을 못 했다
- iOS 사파리는 주소창 접힘에 따라 fixed 바닥이 움직일 수 있다 — 브라우저 동작이라 이번 범위 밖

## Unverified Assumptions

- 없음

## Exact Next Action

<다음 세션(또는 다음 사람)이 첫 번째로 할 일 한 줄>
