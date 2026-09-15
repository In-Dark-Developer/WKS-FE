# Handoff — 05-T5-visitor-map

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: @nicerjs23 (`src/features/` Owner — 리뷰, 05/T7 조립에서 `variant="visitor"` 사용)
- Date: 2026-09-15
- Phase / Task: 05/T5

## Goal

SCR-06 방문자용 궁합 지도(Figma 713:3956)가 props 로만 렌더되고 `/preview` 에서 친구 있음·없음을 볼 수 있다 (PLAN 05/T5).

## Work Completed

- `CompatibilityMap`·`CompatibilityMapScreen` 에 `variant: 'mine' | 'visitor'`(기본 mine) — visitor 는 부제 "<닉네임>님과의 궁합 지도예요."(친구 수 무관), 버튼 자리 위 간격 16px · 테스트 2개 · `/preview` `SCR-06 방문자 지도`·`… · 친구 없음` (commit 573adfb)

## Work In Progress

- 없음 (PR 리뷰 대기)

## Files Changed

- `src/features/friends/map/CompatibilityMap.tsx` · `CompatibilityMapScreen.tsx` · `CompatibilityMapScreen.test.tsx` · `src/app/preview/screens/map.tsx`

## Decisions Made

- 새 화면을 만들지 않고 지도 화면에 `variant` 를 더했다 — 713:3956 이 558:2571 과 부제·버튼·간격만 다르다
- 버튼 슬롯 이름 `share` 는 유지(바꾸면 Touches 밖 `routes.tsx` 수정). 주석으로 visitor 용도를 적었다
- Figma Button/Primary(apricot/300·neutral/900) = 코드 `Button variant="apricot"`. 버튼 자체와 이동은 05/T7 이 app 에서 채운다
- 화면 props 에 주인의 운명·등급·십이간지·행운이 없어 FR-15 는 타입으로 보장된다

## Tests Executed

- `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm build` · 개발 서버(목) `/preview/map` 390px 두 상태 스크린샷·콘솔 오류 확인

## Test Results

- test 282 passed, typecheck·lint 경고 없음, build 성공 · 두 상태 모두 Figma 713:3956 과 같은 구성, 콘솔 오류 없음

## Known Problems

- 순위 목록은 SCR-08 과 같이 전원을 보인다 — 713:3956 캡처는 3줄이지만 기존 지도(05/T2)와 같은 동작을 유지했다

## Unverified Assumptions

- 없음

## Exact Next Action

PR 병합 → 05/T7 이 `s/:shareId` 에서 `<CompatibilityMapScreen variant="visitor" share={…'내 사주 내용도 확인하기'…} />` 조립
