# Handoff — chore-page-backdrops

<!-- 60줄 이내. Task 시작 시 Goal·Work In Progress를 먼저 쓰고(handoff-first) 진행하며 갱신, 종료 시 완성. 덮어쓴다(이력은 git log). 모든 항목을 채운다(없으면 "없음"). 사람에게 넘길 때는 To:에 다음 소유자를 적는다. -->

- From: claude-code
- To: 없음
- Date: 2026-09-13
- Phase / Task: -/-

## Goal

입력·결과·사전신청 화면이 Figma 각 프레임의 배경으로 보인다.

## Work Completed

- `dawn`(기본): 새벽 하늘 사진 + Primary 400→900 overlay (commit f0fc208)
- `result`: 164.75° Primary400→#eee3d2→Primary300, 별자리 리본이 콘텐츠와 함께 스크롤
- `mist`: Primary50→200, 좌우 반전 리본 682px 아래
- 사주 결과 리본: `star-ribbon-loop.webp`(원본 + 상하 반전본) repeat-y 로 콘텐츠 끝까지 이어짐, 콘텐츠와 함께 스크롤. 사전신청은 Figma 대로 좌우 반전 한 장 (commit 463dedb) (commit 878a71a)
- AppShell 을 루트 라우트 element(RootLayout)로 옮겨 handle.backdrop 으로 선택. 오류·첫 대기 화면도 셸 안

## Work In Progress

- 없음

## Files Changed

- `src/app/AppShell.tsx`·`AppShell.test.tsx`·`layout.css`·`App.tsx`
- `src/app/RootLayout.tsx`·`RootLayout.test.tsx`·`routes.tsx`·`routes.test.tsx`
- `src/ui/assets/backgrounds/dawn-sky.webp`·`star-ribbon-loop.webp`

## Decisions Made

- 배경은 화면이 아니라 라우트 handle 로 정한다 — features 가 app 을 import 하지 않고 routes.tsx(T3 소유) 한 곳에서 지정
- 달 SVG·CSS 별 애니메이션 제거 — 기본 프레임 사진에 달이 있고 디자인에 움직이는 별이 없음
- 리본은 스크롤과 함께 움직이고 상하 반전으로 끝점을 이어 반복(소유자 지시). CSS 로는 타일별 반전이 안 돼 두 장을 붙인 에셋을 만듦
- #eee3d2 는 Figma 에 토큰이 없어 layout.css 에 원본 값

## Tests Executed

- `pnpm test`·`typecheck`·`lint`·`build`
- 브라우저 localhost:5173 `/`(dawn)·`/reading/abc`(result)·mist(속성 변경) 육안 확인

## Test Results

- 50 tests 통과, 나머지 통과

## Known Problems

- `src/ui/assets/moon/moon.svg` 는 이제 쓰는 곳이 없다(소유자 제공 파일이라 남김)
- 헤더 '운꿰사' 검은 글자 — dawn 배경에선 보이나 Placeholder 라 T4 에서 교체

## Unverified Assumptions

- 없음

## Exact Next Action

PR 리뷰 후 병합
