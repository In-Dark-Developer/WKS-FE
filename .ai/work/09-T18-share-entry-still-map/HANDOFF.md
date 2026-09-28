# Handoff — 09-T18-share-entry-still-map

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-28
- Phase / Task: 09/T18

## Goal

`/s/:shareId` 로 들어온 신규·기존 방문자 화면이 Figma 30:5916·30:6128 과 같은 구성·배경으로 보인다.

## Work Completed

- 원인: 초대 머리의 주인 지도가 친구 3명 이상이면 구슬이 흐르며 절반 동안 숨어(FR-8) 캡처에 친구 4명 중 1명만 보였다. Figma 4.1·4.2·3.1 은 구슬이 모두 제 궤도에 있다
- `CompatibilityMap` 에 `isStill` — 초대 머리만 멈춤(`data-motion='none'`). 다른 지도의 움직임(FR-8)은 그대로
- 배경은 #278 에서 dawn(사진 + primary-400→900 overlay, Figma 30:6128 과 같은 구성)으로 바뀌어 있음을 확인
- 미리보기 'SCR-06 링크 진입 초대(친구 5명)'

## Work In Progress

- 없음

## Files Changed

- `src/features/friends/{ShareInvite.tsx,ShareInvite.test.tsx,map/CompatibilityMap.tsx}` · `src/app/preview/screens/map.tsx`

## Decisions Made

- Touches 에 `src/app/preview/screens/map.tsx` 를 더했다(미리보기 상태)

## Tests Executed

- `pnpm test` · `typecheck` · `lint` · 목 모드 `/preview` 눈 확인

## Test Results

- 전부 통과, 경고 0

## Known Problems

- 구슬 자리는 닉네임으로 정한 궤도 위 자리라 Figma 목업의 좌표와 똑같지는 않다
- 09/T19 는 '/s/** 전체 배경'이라 입력 화면만 dawn 인 지금은 체크하지 않았다(Figma 4.1.1 결과는 청록 배경)

## Unverified Assumptions

- 없음

## Exact Next Action

PR 리뷰.
